import React, { useEffect, useRef, useState } from 'react';
import './TypingPractice.scss';
import {
  TypingPracticeActionsType,
  TypingPracticeStateType,
} from './TypingPractice.container';
import {
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { t } from 'i18next';
import {
  getDefaultCategory,
  PRACTICE_CATEGORIES,
  PracticeCategoryId,
} from '../../../services/practice/PracticeTexts';

type OwnProps = {};
type TypingPracticeProps = OwnProps &
  Partial<TypingPracticeActionsType> &
  Partial<TypingPracticeStateType>;

export function TypingPractice(props: TypingPracticeProps) {
  const {
    currentCategory,
    sentences,
    currentSentenceIndex,
    currentText,
    userInput,
    errors,
    stats,
    status,
    start,
    updateInput,
    reset,
    updateCategory,
    updateSentences,
    nextSentence,
    exitPracticeMode,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load sentences when category changes or on mount
  useEffect(() => {
    if (currentCategory && updateSentences) {
      const category = PRACTICE_CATEGORIES.find(
        (cat) => cat.id === currentCategory
      );
      if (category && category.sentences.length > 0) {
        // Randomly select 5 sentences from the category
        const shuffled = [...category.sentences].sort(
          () => Math.random() - 0.5
        );
        const selectedSentences = shuffled.slice(0, 5);
        updateSentences(selectedSentences);
      }
    }
  }, [currentCategory, updateSentences]);

  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status, currentText]);

  useEffect(() => {
    if (status === 'finished') {
      // Check if there are more sentences in the set
      const hasMoreSentences =
        sentences &&
        currentSentenceIndex !== undefined &&
        currentSentenceIndex < sentences.length - 1;

      if (hasMoreSentences) {
        // Immediately move to next sentence
        if (nextSentence) {
          nextSentence();
        }
      } else {
        // All sentences completed
        setSnackbarOpen(true);
      }
    }
  }, [status, sentences, currentSentenceIndex, nextSentence]);

  // Add this new useEffect hook
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && reset) {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reset]); // Depend on 'reset' prop to ensure the latest 'reset' function is used

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'running' && updateInput) {
      // Prevent deleting already typed characters (no backspace allowed)
      if (e.target.value.length >= (userInput?.length || 0)) {
        updateInput(e.target.value);
      }
    }
  };

  const handleStart = () => {
    if (start) {
      start();
    }
  };

  const handleReset = () => {
    if (reset) {
      reset();
    }
  };

  const handleExit = () => {
    if (exitPracticeMode) {
      exitPracticeMode();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const categoryId = event.target.value as PracticeCategoryId;
    if (updateCategory) {
      updateCategory(categoryId);
    }
  };

  const renderText = () => {
    if (!currentText || !userInput) {
      return <span className="text-pending">{currentText}</span>;
    }

    const chars = currentText.split('');
    return chars.map((char, index) => {
      let className = 'text-pending';
      if (index < (userInput?.length || 0)) {
        const isError = errors?.some((error) => error.index === index);
        className = isError ? 'text-error' : 'text-correct';
      } else if (index === userInput?.length) {
        className = 'text-current';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-practice-container">
      <Box className="practice-header">
        <Typography variant="h6">{t('Typing Practice')}</Typography>
        <IconButton
          className="close-button"
          onClick={handleExit}
          aria-label={t('Exit practice mode')}
          title={t('Exit practice mode')}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="practice-content">
        {/* Category Selection */}
        <Box className="category-selection">
          <FormControl fullWidth size="small">
            <InputLabel id="category-select-label">
              {t('Practice Category')}
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={currentCategory || getDefaultCategory().id}
              label={t('Practice Category')}
              onChange={handleCategoryChange as any}
              disabled={status === 'running'}
            >
              {PRACTICE_CATEGORIES.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Progress Indicator */}
        {sentences && sentences.length > 0 && (
          <Box className="progress-indicator">
            <LinearProgress
              variant="determinate"
              value={
                status === 'finished'
                  ? 100
                  : ((currentSentenceIndex || 0) / (sentences.length || 1)) *
                    100
              }
              className="progress-bar"
            />
          </Box>
        )}

        {/* Text Display */}
        <Box className="text-display">{renderText()}</Box>

        {/* Input Field */}
        {status === 'running' && (
          <input
            ref={inputRef}
            type="text"
            className="typing-input"
            value={userInput}
            onChange={handleInputChange}
            placeholder={t('Start typing...')}
            autoFocus
          />
        )}

        {/* Statistics Panel */}
        <Box className="stats-panel">
          <Typography variant="body2">
            {t('Time')}:{' '}
            <strong>
              {stats?.startTime && stats?.endTime
                ? ((stats.endTime - stats.startTime) / 1000).toFixed(2)
                : 0}
            </strong>{' '}
            {t('sec')}
          </Typography>
          <Typography variant="body2">
            {t('Speed')}: <strong>{stats?.cps || 0}</strong> {t('chars')}/
            {t('sec')}
          </Typography>
          <Typography variant="body2">
            {t('Accuracy')}: <strong>{stats?.accuracy || 100}%</strong>
          </Typography>
          <Typography variant="body2">
            {t('Correct')}: <strong>{stats?.correctChars || 0}</strong> |{' '}
            {t('Incorrect')}: <strong>{stats?.incorrectChars || 0}</strong>
          </Typography>
        </Box>

        {/* Control Buttons */}
        <Box className="control-buttons">
          {status === 'idle' && (
            <Button variant="contained" color="primary" onClick={handleStart}>
              {t('Start Practice')}
            </Button>
          )}
          {(status === 'running' || status === 'finished') && (
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              {t('Reset')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Completion Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={t('Completed! Great job!')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}
