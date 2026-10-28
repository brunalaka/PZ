import React, { useState } from 'react';
import {
  Box,
  Button,
  Connection,
  ConnectionSlot,
  ConnectionStop,
  HeaderBar,
  Heading,
  Infobox,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowLeft,
  IconArrowRight,
  IconBus,
  IconDirections,
  IconPinLive,
  IconSeat,
  IconStation,
  IconWalletReal,
} from '@flixbus/honeycomb-icons-react';
import './travel-day-v2.css';

const QrCodeSvg = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 210 210"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="td2-qr-svg"
  >
    <rect width="210" height="210" fill="white" />
    <rect x="0" y="0" width="70" height="10" fill="#353535" />
    <rect x="0" y="60" width="70" height="10" fill="#353535" />
    <rect x="0" y="10" width="10" height="50" fill="#353535" />
    <rect x="60" y="10" width="10" height="50" fill="#353535" />
    <rect x="20" y="20" width="30" height="30" fill="#353535" />
    <rect x="140" y="0" width="70" height="10" fill="#353535" />
    <rect x="140" y="60" width="70" height="10" fill="#353535" />
    <rect x="140" y="10" width="10" height="50" fill="#353535" />
    <rect x="200" y="10" width="10" height="50" fill="#353535" />
    <rect x="160" y="20" width="30" height="30" fill="#353535" />
    <rect x="0" y="140" width="70" height="10" fill="#353535" />
    <rect x="0" y="200" width="70" height="10" fill="#353535" />
    <rect x="0" y="150" width="10" height="50" fill="#353535" />
    <rect x="60" y="150" width="10" height="50" fill="#353535" />
    <rect x="20" y="160" width="30" height="30" fill="#353535" />
    <rect x="80" y="60" width="10" height="10" fill="#353535" />
    <rect x="100" y="60" width="10" height="10" fill="#353535" />
    <rect x="120" y="60" width="10" height="10" fill="#353535" />
    <rect x="60" y="80" width="10" height="10" fill="#353535" />
    <rect x="60" y="100" width="10" height="10" fill="#353535" />
    <rect x="60" y="120" width="10" height="10" fill="#353535" />
    <rect x="80" y="80" width="10" height="10" fill="#353535" />
    <rect x="100" y="80" width="10" height="10" fill="#353535" />
    <rect x="120" y="80" width="10" height="10" fill="#353535" />
    <rect x="150" y="80" width="10" height="10" fill="#353535" />
    <rect x="180" y="80" width="10" height="10" fill="#353535" />
    <rect x="90" y="90" width="10" height="10" fill="#353535" />
    <rect x="130" y="90" width="10" height="10" fill="#353535" />
    <rect x="160" y="90" width="10" height="10" fill="#353535" />
    <rect x="200" y="90" width="10" height="10" fill="#353535" />
    <rect x="80" y="100" width="10" height="10" fill="#353535" />
    <rect x="110" y="100" width="10" height="10" fill="#353535" />
    <rect x="140" y="100" width="10" height="10" fill="#353535" />
    <rect x="170" y="100" width="10" height="10" fill="#353535" />
    <rect x="190" y="100" width="10" height="10" fill="#353535" />
    <rect x="90" y="110" width="10" height="10" fill="#353535" />
    <rect x="120" y="110" width="10" height="10" fill="#353535" />
    <rect x="150" y="110" width="10" height="10" fill="#353535" />
    <rect x="180" y="110" width="10" height="10" fill="#353535" />
    <rect x="80" y="120" width="10" height="10" fill="#353535" />
    <rect x="110" y="120" width="10" height="10" fill="#353535" />
    <rect x="130" y="120" width="10" height="10" fill="#353535" />
    <rect x="160" y="120" width="10" height="10" fill="#353535" />
    <rect x="200" y="120" width="10" height="10" fill="#353535" />
    <rect x="80" y="130" width="10" height="10" fill="#353535" />
    <rect x="100" y="130" width="10" height="10" fill="#353535" />
    <rect x="140" y="130" width="10" height="10" fill="#353535" />
    <rect x="170" y="130" width="10" height="10" fill="#353535" />
    <rect x="80" y="140" width="10" height="10" fill="#353535" />
    <rect x="120" y="140" width="10" height="10" fill="#353535" />
    <rect x="150" y="140" width="10" height="10" fill="#353535" />
    <rect x="190" y="140" width="10" height="10" fill="#353535" />
    <rect x="80" y="150" width="10" height="10" fill="#353535" />
    <rect x="110" y="150" width="10" height="10" fill="#353535" />
    <rect x="140" y="150" width="10" height="10" fill="#353535" />
    <rect x="170" y="150" width="10" height="10" fill="#353535" />
    <rect x="200" y="150" width="10" height="10" fill="#353535" />
    <rect x="80" y="160" width="10" height="10" fill="#353535" />
    <rect x="100" y="160" width="10" height="10" fill="#353535" />
    <rect x="130" y="160" width="10" height="10" fill="#353535" />
    <rect x="160" y="160" width="10" height="10" fill="#353535" />
    <rect x="190" y="160" width="10" height="10" fill="#353535" />
    <rect x="90" y="170" width="10" height="10" fill="#353535" />
    <rect x="120" y="170" width="10" height="10" fill="#353535" />
    <rect x="150" y="170" width="10" height="10" fill="#353535" />
    <rect x="180" y="170" width="10" height="10" fill="#353535" />
    <rect x="80" y="180" width="10" height="10" fill="#353535" />
    <rect x="110" y="180" width="10" height="10" fill="#353535" />
    <rect x="140" y="180" width="10" height="10" fill="#353535" />
    <rect x="170" y="180" width="10" height="10" fill="#353535" />
    <rect x="200" y="180" width="10" height="10" fill="#353535" />
    <rect x="80" y="190" width="10" height="10" fill="#353535" />
    <rect x="100" y="190" width="10" height="10" fill="#353535" />
    <rect x="130" y="190" width="10" height="10" fill="#353535" />
    <rect x="160" y="190" width="10" height="10" fill="#353535" />
    <rect x="90" y="200" width="10" height="10" fill="#353535" />
    <rect x="120" y="200" width="10" height="10" fill="#353535" />
    <rect x="150" y="200" width="10" height="10" fill="#353535" />
    <rect x="190" y="200" width="10" height="10" fill="#353535" />
  </svg>
);

export const TravelDayV2Page = () => {
  const [isBoardingTime, setIsBoardingTime] = useState(false);

  return (
    <div className="td2-page">
      <HeaderBar fixed extraClasses="td2-header">
        <Button
          appearance="link"
          aria-label="Back"
          extraClasses="td2-header__back"
        >
          <Icon InlineIcon={IconArrowLeft} aria-hidden="true" />
          Back
        </Button>
        <Heading size={3} Elem="span" flushSpace extraClasses="td2-header__title">
          My Trip
        </Heading>
        <span className="td2-header__spacer" aria-hidden="true" />
      </HeaderBar>

      {/* Status banner — edge-to-edge, inspired by Trainline */}
      <div className="td2-status-wrap">
        <Infobox
          appearance="success"
          small
          strong
          extraClasses="td2-infobox"
          aria-label="Trip status"
        >
          <div className="td2-status-content">
            <span className="td2-status-text">
              {isBoardingTime
                ? 'On time · Now boarding at Platform 3'
                : 'On time · Bus departs in 1h 23min'}
            </span>
            <Button appearance="link" extraClasses="td2-status-link">
              Live tracking
              <Icon
                InlineIcon={IconArrowRight}
                size={3}
                aria-hidden="true"
                extraClasses="td2-status-link__icon"
              />
            </Button>
          </div>
        </Infobox>
      </div>

      <main className="td2-main">
        {/* Journey card: route + prominent platform + seat tiles */}
        <Box extraClasses="td2-card">
          <Text small Elem="span" extraClasses="td2-journey-date">
            Today, Thu 8 Oct
          </Text>

          <Connection appearance="success" extraClasses="td2-connection">
            <ConnectionStop time="08:45" station="Berlin ZOB (Central Bus Station)" />
            <ConnectionSlot>
              <div className="td2-connection-slot">
                <Icon
                  InlineIcon={IconBus}
                  size={3}
                  aria-hidden="true"
                  extraClasses="td2-connection-slot__icon"
                />
                <Text small Elem="span">
                  FlixBus 1234 · direction Hamburg
                </Text>
              </div>
            </ConnectionSlot>
            <ConnectionStop time="14:20" station="Hamburg ZOB (Central Bus Station)" />
          </Connection>

          {/* Platform + Seat tiles — most time-sensitive facts, above the fold */}
          <div className="td2-tiles">
            <div className="td2-tile">
              <span className="td2-tile__label">
                <Icon InlineIcon={IconStation} size={3} aria-hidden="true" />
                Platform
              </span>
              <Heading size={1} Elem="span" flushSpace extraClasses="td2-tile__value">
                3
              </Heading>
            </div>
            <div className="td2-tile td2-tile--right">
              <span className="td2-tile__label">
                <Icon InlineIcon={IconSeat} size={3} aria-hidden="true" />
                Seat
              </span>
              <Heading size={3} Elem="span" flushSpace extraClasses="td2-tile__value">
                Row 12 · A
              </Heading>
            </div>
          </div>
        </Box>

        {/* Boarding QR card — always visible, inspired by Fly Delta */}
        <Box highlighted extraClasses="td2-card td2-qr-card">
          <Heading size={4} flushSpace extraClasses="td2-qr-title">
            Boarding pass
          </Heading>
          <Text small extraClasses="td2-qr-subtitle">
            Show this code at Platform 3 to board
          </Text>
          <div className="td2-qr-wrapper">
            <div className="td2-qr-frame">
              <QrCodeSvg />
            </div>
          </div>
          <Text small extraClasses="td2-qr-route">
            Berlin ZOB → Hamburg ZOB
          </Text>
          <Button appearance="link" extraClasses="td2-wallet-btn">
            <Icon InlineIcon={IconWalletReal} size={3} aria-hidden="true" />
            Add to Apple Wallet
          </Button>
        </Box>

        {/* Adaptive CTAs — context-aware: directions pre-departure, track bus at boarding */}
        <div className="td2-actions">
          {isBoardingTime ? (
            <>
              <Button appearance="primary" display="block" size="lg">
                <Icon InlineIcon={IconPinLive} aria-hidden="true" />
                Track bus
              </Button>
              <Button display="block" size="lg">
                <Icon InlineIcon={IconDirections} aria-hidden="true" />
                Get directions to station
              </Button>
            </>
          ) : (
            <>
              <Button appearance="primary" display="block" size="lg">
                <Icon InlineIcon={IconDirections} aria-hidden="true" />
                Get directions to station
              </Button>
              <Button display="block" size="lg">
                <Icon InlineIcon={IconPinLive} aria-hidden="true" />
                Track bus
              </Button>
            </>
          )}
        </div>

        {/* Prototype state toggle */}
        <div className="td2-toggle">
          <Text small Elem="span" extraClasses="td2-toggle__label">
            Prototype:
          </Text>
          <Button
            appearance="link"
            onClick={() => setIsBoardingTime(!isBoardingTime)}
            extraClasses="td2-toggle__btn"
          >
            {isBoardingTime ? '← Switch to pre-departure' : 'Switch to boarding time →'}
          </Button>
        </div>
      </main>
    </div>
  );
};
