import React, { useEffect, useRef, useState } from 'react';
import './TypingPractice.scss';
import {
  TypingPracticeActionsType,
  TypingPracticeStateType,
} from './TypingPractice.container';
import { Button, Typography, Box, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { t } from 'i18next';

type OwnProps = {};
type TypingPracticeProps = OwnProps &
  Partial<TypingPracticeActionsType> &
  Partial<TypingPracticeStateType>;

export function TypingPractice(props: TypingPracticeProps) {
  const {
    currentText,
    userInput,
    errors,
    stats,
    status,
    start,
    updateInput,
    reset,
    exitPracticeMode,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'finished') {
      setSnackbarOpen(true);
    }
  }, [status]);

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
      updateInput(e.target.value);
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
