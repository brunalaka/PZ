import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Flag,
  Header,
  HeaderBrand,
  HeaderBurgerMenu,
  HeaderNavigation,
  HeaderSubNavigation,
  HeaderWidgets,
  Input,
  NavItem,
  Radio,
  Select,
  SelectOption,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowDown,
  IconArrowRightL,
  IconCalendarSolid,
  IconInfo,
  IconPinSolid,
  IconProfileSolid,
  IconSpark,
} from '@flixbus/honeycomb-icons-react';

import heroImage from './assets/hero.png';
import { useTypingAnimation } from './use-typing-animation';
import './home-page.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const typedText = useTypingAnimation();

  return (
    <div
      className="aif-page"
      style={{
        '--ai-color': '#e100e1',
        '--ai-dark-color': '#8f008f',
      } as React.CSSProperties}
    >
      <Header
        fixed
        brand={
          <HeaderBrand
            alt="FlixBus logo"
            href="/ai-flow/home"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          />
        }
        navigation={
          <HeaderNavigation aria-label="Main">
            <NavItem subMenu={
              <HeaderSubNavigation id="aif-subnav-plan">
                <NavItem href="#">Trips</NavItem>
                <NavItem href="#">Groups</NavItem>
                <NavItem href="#">FlixTrain</NavItem>
              </HeaderSubNavigation>
            }>Plan Your Journey</NavItem>
            <NavItem subMenu={
              <HeaderSubNavigation id="aif-subnav-service">
                <NavItem href="#">Luggage</NavItem>
                <NavItem href="#">Accessibility</NavItem>
                <NavItem href="#">On board</NavItem>
              </HeaderSubNavigation>
            }>Service</NavItem>
            <NavItem href="#">Manage My Booking</NavItem>
            <NavItem href="#">Trip Tracker</NavItem>
            <NavItem href="#">Help</NavItem>
          </HeaderNavigation>
        }
        burgerMenu={
          <HeaderBurgerMenu
            panelId="aif-burger-panel"
            openPanelLabel="Open main menu"
            closePanelLabel="Close main menu"
            applyWidgetContainer
            widgets={
              <button className="aif-header-widget" aria-label="Account">
                <Icon InlineIcon={IconProfileSolid} aria-hidden="true" />
              </button>
            }
          >
            <HeaderNavigation aria-label="Main">
              <NavItem shouldCloseDialog href="#">Plan your journey</NavItem>
              <NavItem shouldCloseDialog href="#">Service</NavItem>
              <NavItem shouldCloseDialog href="#">Real-Time Info</NavItem>
              <NavItem shouldCloseDialog href="#">Help</NavItem>
            </HeaderNavigation>
          </HeaderBurgerMenu>
        }
        widgets={
          <HeaderWidgets>
            <div className="aif-header-widgets-row">
              <button className="aif-header-widget" aria-label="Language: English">
                <Flag countryCode="us" countryName="United States" size={4} />
                English
                <Icon InlineIcon={IconArrowDown} aria-hidden="true" extraClasses="aif-header-widget__chevron" />
              </button>
              <button className="aif-header-widget" aria-label="Account">
                <Icon InlineIcon={IconProfileSolid} aria-hidden="true" />
              </button>
            </div>
          </HeaderWidgets>
        }
      />

      <div className="aif-hero">
        <img className="aif-hero__img" src={heroImage} alt="FlixBus coach on the road" />
      </div>

      <div className="aif-form">
        <div className="aif-form__box">
        {/* AI box */}
        <div className="aif-ai-box" role="button" tabIndex={0} onClick={() => navigate('/ai-flow/chat')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/ai-flow/chat'); }}>
          <div className="aif-ai-box__bg" />
          <div className="aif-ai-box__gradient" />
          <div className="aif-ai-box__icon">
            <Icon InlineIcon={IconSpark} aria-hidden="true" size={6} extraClasses="aif-ai-box__spark" />
          </div>
          <div className="aif-ai-box__content">
            <div className="aif-ai-box__slots">
              <p className="aif-ai-box__title">Find your trip with AI</p>
              <p className="aif-ai-box__body" aria-live="polite">
                You can ask: <em>{typedText}</em>
              </p>
            </div>
            <Button
              display="square"
              aria-label="Find trip with AI"
              extraClasses="aif-ai-box__arrow"
              onClick={() => navigate('/ai-flow/chat')}
            >
              <Icon InlineIcon={IconArrowRightL} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Trip type */}
        <div className="aif-trip-type">
          <Radio
            id="aif-trip-one-way"
            name="aif-trip-type"
            value="one-way"
            label="One Way"
            defaultChecked
          />
          <Radio
            id="aif-trip-round-trip"
            name="aif-trip-type"
            value="round-trip"
            label="Round Trip"
          />
        </div>

        <div className="aif-form__fields-row">
          {/* From */}
          <Input
            id="aif-from"
            label="From"
            iconLeft={
              <Icon InlineIcon={IconPinSolid} aria-hidden="true" extraClasses="aif-input-icon" />
            }
          />

          {/* To */}
          <Input
            id="aif-to"
            label="To"
            iconLeft={
              <Icon InlineIcon={IconPinSolid} aria-hidden="true" extraClasses="aif-input-icon" />
            }
          />

          {/* Departure */}
          <Input
            id="aif-departure"
            label="Departure"
            iconLeft={
              <Icon InlineIcon={IconCalendarSolid} aria-hidden="true" extraClasses="aif-input-icon" />
            }
          />

          {/* Passengers */}
          <Select id="aif-passengers" label="Passengers">
            <SelectOption value="1-adult">1 Adult</SelectOption>
            <SelectOption value="2-adults">2 Adults</SelectOption>
            <SelectOption value="3-adults">3 Adults</SelectOption>
            <SelectOption value="1-adult-1-child">1 Adult + 1 Child</SelectOption>
          </Select>

          {/* Search CTA */}
          <Button
            appearance="primary"
            display="block"
            extraClasses="aif-form__search-btn"
            onClick={() => navigate('/ai-flow/results')}
          >
            Search
          </Button>
        </div>

        {/* Accommodation checkbox — desktop only */}
        <Checkbox
          id="aif-accommodation"
          value="accommodation"
          label={
            <span className="aif-form__accommodation-label">
              Find my accommodation
              <Icon InlineIcon={IconInfo} aria-hidden="true" extraClasses="aif-form__accommodation-info" />
            </span>
          }
          extraClasses="aif-form__accommodation"
          small
        />
        </div>
      </div>
    </div>
  );
};
