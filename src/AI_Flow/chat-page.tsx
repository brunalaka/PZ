import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BackButton,
  Button,
  Header,
  HeaderBrand,
  Tag,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconCash,
  IconCheckmark,
  IconElectricity,
  IconDelete,
  IconMicrophone,
  IconSend,
  IconSpark,
  IconTrain,
  IconTrip,
  type IconComponent,
} from '@flixbus/honeycomb-icons-react';

import { useTypingAnimation } from './use-typing-animation';
import './chat-page.css';

const FILTER_TAGS: { label: string; icon: IconComponent }[] = [
  { label: 'Direct trips only', icon: IconTrip },
  { label: 'Fastest trips', icon: IconElectricity },
  { label: 'Cheapest trips', icon: IconCash },
  { label: 'Trains only', icon: IconTrain },
];

const BAR_COUNT = 200;

export const ChatPage = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [bars, setBars] = React.useState<(number | null)[]>(() => Array(BAR_COUNT).fill(null));
  const typedText = useTypingAnimation(isFocused);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleValidateAudio = () => {
    setIsRecording(false);
    setInputValue('I want to travel from New York to Boston in September');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setInputValue('');
  };

  React.useEffect(() => {
    if (!isRecording) return;

    setBars(Array(BAR_COUNT).fill(null));
    let phase = 0;

    const id = setInterval(() => {
      phase += 0.18;
      const raw =
        Math.sin(phase * 1.3) * 0.35 +
        Math.sin(phase * 3.9) * 0.25 +
        (Math.random() - 0.2) * 0.4;
      const amp = Math.min(1, Math.max(0, raw));
      setBars((prev) => [...prev.slice(1), amp]);
    }, 80);

    return () => clearInterval(id);
  }, [isRecording]);

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div
      className="aif-chat-page"
      style={{
        '--ai-color': '#e100e1',
        '--ai-dark-color': '#8f008f',
      } as React.CSSProperties}
    >
      <Header
        brand={
          <HeaderBrand
            alt="FlixBus logo"
            href="/ai-flow/home"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          />
        }
        burgerMenu={
          <BackButton
            aria-label="Go back to home"
            extraClasses="aif-chat-page__back-btn"
            onClick={() => navigate('/ai-flow/home')}
          />
        }
      />

      <div className="aif-chat-page__content">
        <BackButton
          aria-label="Go back to home"
          extraClasses="aif-chat-page__back-btn-desktop"
          onClick={() => navigate('/ai-flow/home')}
        >
          Back
        </BackButton>
        <div className="aif-chat-page__intro">
          <Icon
            InlineIcon={IconSpark}
            aria-hidden="true"
            size={10}
            extraClasses="aif-chat-page__spark"
          />
          <p className="aif-chat-page__title">Find your trip with AI</p>
          <p className="aif-chat-page__subtitle">
            Tell us where you&apos;re traveling from and to, when you want to go,
            and whether you&apos;re traveling with others. We&apos;ll find the best options for you.
          </p>
        </div>
        <p className="aif-chat-page__disclaimer">
          Answers are powered by AI and it can make mistakes.
        </p>
      </div>

      <div className="aif-chat-page__footer">
        {isRecording ? (
          <div className="aif-chat-page__audio-box">
            <Button
              appearance="link"
              display="square"
              aria-label="Cancel recording"
              onClick={handleDeleteRecording}
            >
              <Icon InlineIcon={IconDelete} aria-hidden="true" />
            </Button>
            <div className="aif-chat-page__waveform" aria-label="Recording in progress">
              {([...bars].reverse().filter((amp): amp is number => amp !== null)).map((amp, i) => (
                <span
                  key={i}
                  className="aif-chat-page__waveform-bar"
                  style={{ height: `${Math.max(3, amp * 26)}px` }}
                />
              ))}
            </div>
            <Button
              appearance="secondary"
              display="square"
              aria-label="Confirm recording"
              onClick={handleValidateAudio}
            >
              <Icon InlineIcon={IconCheckmark} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <>
            <div className="aif-chat-page__input-row">
              <div className={`aif-chat-page__input${!isFocused && !inputValue ? ' aif-chat-page__input--idle' : ''}`}>
                <textarea
                  ref={textareaRef}
                  id="aif-chat-input"
                  className="aif-chat-page__input-field"
                  aria-label="Find your trip with AI"
                  placeholder={!isFocused && typedText ? typedText : ''}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                      e.preventDefault();
                      navigate('/ai-flow/results', {
                        state: { query: inputValue.trim(), activeFilters },
                      });
                    }
                  }}
                />
              </div>
              {inputValue ? (
                <Button
                  appearance="primary"
                  display="square"
                  aria-label="Send"
                  onClick={() => {
                    if (!inputValue.trim()) return;
                    navigate('/ai-flow/results', {
                      state: { query: inputValue.trim(), activeFilters },
                    });
                  }}
                >
                  <Icon InlineIcon={IconSend} aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  appearance="link"
                  display="square"
                  aria-label="Record audio"
                  onClick={() => setIsRecording(true)}
                >
                  <Icon InlineIcon={IconMicrophone} aria-hidden="true" />
                </Button>
              )}
            </div>
            <div className="aif-chat-page__tags" role="group" aria-label="Filter options">
              {FILTER_TAGS.map(({ label, icon }) => {
                const isActive = activeFilters.includes(label);
                return (
                  <Tag
                    key={label}
                    Elem="button"
                    appearance={isActive ? 'selected' : undefined}
                    display={isActive ? 'subtle' : 'outlined'}
                    onClick={() => toggleFilter(label)}
                    aria-pressed={isActive}
                  >
                    <Icon InlineIcon={icon} aria-hidden="true" extraClasses="aif-chat-page__tag-icon" />
                    {label}
                  </Tag>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
