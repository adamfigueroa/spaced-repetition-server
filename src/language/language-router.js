const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
const bodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const nextPracticeWord = await LanguageService.getNextWord(
      req.app.get('db'),
      req.language.head
    );
    res.json({
      nextWord: nextPracticeWord.original,
      wordCorrectCount: nextPracticeWord.correct_count,
      wordIncorrectCount: nextPracticeWord.incorrect_count,
      totalScore: req.language.total_score,
    });
  } catch (e) {
    next(e);
  }
});

languageRouter.route('/guess').post(bodyParser, async (req, res, next) => {
  if (!Object.keys(req.body).includes('guess')) {
    return res.status(400).json({
      error: `Missing 'guess' in request body`,
    });
  }

  const words = await LanguageService.getLanguageWords(
    req.app.get('db'),
    req.language.id
  );

  const newWordList = LanguageService.populateWords(
    req.app.get('db'),
    req.language,
    words
  );

  console.dir(newWordList);

  if (req.body.guess === newWordList.head.value.translation) {
    newWordList.head.value.correct_count++;
    newWordList.head.value.memory_value =
      newWordList.head.value.memory_value * 2 >= newWordList.listNodes().length
        ? newWordList.listNodes().length - 1
        : newWordList.head.value.memory_value * 2;
    newWordList.total_score++;
    newWordList.moveHead(newWordList.head.value.memory_value);

    LanguageService.persistLL(req.app.get('db'), newWordList).then(() => {
      res.json({
        nextWord: newWordList.head.value.original,
        wordCorrectCount: newWordList.head.value.correct_count,
        wordIncorrectCount: newWordList.head.value.incorrect_count,
        totalScore: newWordList.total_score,
        answer: req.body.guess,
        isCorrect: true,
      });
      next();
    });
  } else {
    newWordList.head.value.incorrect_count++;
    newWordList.head.value.memory_value = 1;
    let correct = newWordList.head.value.translation;
    newWordList.moveHead(newWordList.head.value.memory_value);

    LanguageService.persistLL(req.app.get('db'), newWordList).then(() => {
      res.json({
        nextWord: newWordList.head.value.original,
        totalScore: newWordList.total_score,
        wordCorrectCount: newWordList.head.value.correct_count,
        wordIncorrectCount: newWordList.head.value.incorrect_count,
        answer: correct,
        isCorrect: false,
      });
      next();
    });
  }
});

module.exports = languageRouter;
