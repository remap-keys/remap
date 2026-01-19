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
  Menu,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { t } from 'i18next';
import ConfirmDialog from '../../common/confirm/ConfirmDialog';
import {
  getDefaultCategory,
  PRACTICE_CATEGORIES,
  PracticeCategoryId,
} from '../../../services/practice/PracticeTexts';

import MoreVertIcon from '@mui/icons-material/MoreVert';

type OwnProps = {};
type TypingPracticeProps = OwnProps &
  Partial<TypingPracticeActionsType> &
  Partial<TypingPracticeStateType>;

export function TypingPractice(props: TypingPracticeProps) {
  const {
    keyboardId,
    signedIn,
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
    updateStats,
    reset,
    resetStatistics,
    loadTypingStats,
    saveTypingStats,
    updateCategory,
    updateSentences,
    nextSentence,
    exitPracticeMode,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedStatsRef = useRef(false);

  // Load typing stats from Firestore on mount
  useEffect(() => {
    if (
      keyboardId &&
      signedIn &&
      loadTypingStats &&
      !hasLoadedStatsRef.current
    ) {
      hasLoadedStatsRef.current = true;
      loadTypingStats(keyboardId);
    }
  }, [keyboardId, signedIn, loadTypingStats]);

  // Save typing stats on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (keyboardId && signedIn && saveTypingStats) {
        saveTypingStats(keyboardId);
      }
    };
  }, [keyboardId, signedIn, saveTypingStats]);

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
        // All sentences completed - save stats to Firestore
        if (keyboardId && signedIn && saveTypingStats) {
          saveTypingStats(keyboardId);
        }
        setSnackbarOpen(true);
      }
    }
  }, [
    status,
    sentences,
    currentSentenceIndex,
    nextSentence,
    keyboardId,
    signedIn,
    saveTypingStats,
  ]);

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

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      if (start) {
        start();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, start]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmDialog = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };

  const handleConfirmReset = () => {
    if (keyboardId && resetStatistics) {
      resetStatistics(keyboardId);
    }
    setConfirmOpen(false);
  };

  const handleCancelReset = () => {
    setConfirmOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'running' && updateInput && updateStats) {
      const newValue = e.target.value;
      const oldValue = userInput || '';

      // Only proceed if a character was added
      if (newValue.length > oldValue.length) {
        const typedChar = newValue.slice(-1);
        const expectedCharIndex = oldValue.length;
        const expectedChar = currentText?.[expectedCharIndex];

        if (keyboardId && expectedChar) {
          const isCorrect = typedChar === expectedChar;
          updateStats(keyboardId, expectedChar, isCorrect);

          // Debounced save to Firestore (5 seconds)
          if (signedIn && saveTypingStats) {
            if (saveTimeoutRef.current) {
              clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
              saveTypingStats(keyboardId);
            }, 5000);
          }
        }
      }

      // Prevent deleting already typed characters (no backspace allowed)
      if (e.target.value.length >= (userInput?.length || 0)) {
        updateInput(e.target.value);
      }
    }
  };

  const handleStart = () => {
    setCountdown(3);
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
        <Box>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleOpenConfirmDialog}>
              {t('Reset Statistics')}
            </MenuItem>
          </Menu>
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
      </Box>

      <Box className="practice-content">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {/* Category Selection */}
          <Box className="category-selection" sx={{ flexGrow: 1 }}>
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
                disabled={status === 'running' || countdown !== null}
              >
                {PRACTICE_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Control Buttons */}
          <Box className="control-buttons">
            {status === 'idle' && countdown === null && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStart}
                sx={{ whiteSpace: 'nowrap', height: '36.5px' }}
              >
                {t('Start Practice')}
              </Button>
            )}
            {(status === 'running' || status === 'finished') && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                sx={{ height: '36.5px' }}
              >
                {t('Reset')}
              </Button>
            )}
          </Box>
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

        {/* Countdown Display */}
        {countdown !== null && (
          <Box className="countdown-display">
            <Typography
              key={countdown}
              variant="h1"
              className="countdown-number"
            >
              {countdown === 0 ? t('Go!') : countdown}
            </Typography>
          </Box>
        )}

        {/* Text Display */}
        {countdown === null && (
          <Box className="text-display">{renderText()}</Box>
        )}

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
      </Box>

      {/* Completion Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={t('Completed! Great job!')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={t('Reset Statistics')}
        message={t(
          'Are you sure you want to reset your typing statistics? This action cannot be undone.'
        )}
        onClickYes={handleConfirmReset}
        onClickNo={handleCancelReset}
      />
    </div>
  );
}
