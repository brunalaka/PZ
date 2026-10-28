import React from 'react';
import {
  Box,
  Button,
  Connection,
  ConnectionSlot,
  ConnectionStop,
  HeaderBar,
  Heading,
  Tag,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowLeft,
  IconBus,
  IconDirections,
  IconPinLive,
  IconSeat,
  IconStation,
} from '@flixbus/honeycomb-icons-react';
import './travel-day.css';

const QrCodeSvg = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 210 210"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="td-qr-svg"
  >
    <rect width="210" height="210" fill="white" />

    {/* Top-left finder pattern */}
    <rect x="0" y="0" width="70" height="10" fill="#353535" />
    <rect x="0" y="60" width="70" height="10" fill="#353535" />
    <rect x="0" y="10" width="10" height="50" fill="#353535" />
    <rect x="60" y="10" width="10" height="50" fill="#353535" />
    <rect x="20" y="20" width="30" height="30" fill="#353535" />

    {/* Top-right finder pattern */}
    <rect x="140" y="0" width="70" height="10" fill="#353535" />
    <rect x="140" y="60" width="70" height="10" fill="#353535" />
    <rect x="140" y="10" width="10" height="50" fill="#353535" />
    <rect x="200" y="10" width="10" height="50" fill="#353535" />
    <rect x="160" y="20" width="30" height="30" fill="#353535" />

    {/* Bottom-left finder pattern */}
    <rect x="0" y="140" width="70" height="10" fill="#353535" />
    <rect x="0" y="200" width="70" height="10" fill="#353535" />
    <rect x="0" y="150" width="10" height="50" fill="#353535" />
    <rect x="60" y="150" width="10" height="50" fill="#353535" />
    <rect x="20" y="160" width="30" height="30" fill="#353535" />

    {/* Timing patterns */}
    <rect x="80" y="60" width="10" height="10" fill="#353535" />
    <rect x="100" y="60" width="10" height="10" fill="#353535" />
    <rect x="120" y="60" width="10" height="10" fill="#353535" />
    <rect x="60" y="80" width="10" height="10" fill="#353535" />
    <rect x="60" y="100" width="10" height="10" fill="#353535" />
    <rect x="60" y="120" width="10" height="10" fill="#353535" />

    {/* Data modules — row 8 */}
    <rect x="80" y="80" width="10" height="10" fill="#353535" />
    <rect x="100" y="80" width="10" height="10" fill="#353535" />
    <rect x="120" y="80" width="10" height="10" fill="#353535" />
    <rect x="150" y="80" width="10" height="10" fill="#353535" />
    <rect x="180" y="80" width="10" height="10" fill="#353535" />
    {/* Row 9 */}
    <rect x="90" y="90" width="10" height="10" fill="#353535" />
    <rect x="130" y="90" width="10" height="10" fill="#353535" />
    <rect x="160" y="90" width="10" height="10" fill="#353535" />
    <rect x="200" y="90" width="10" height="10" fill="#353535" />
    {/* Row 10 */}
    <rect x="80" y="100" width="10" height="10" fill="#353535" />
    <rect x="110" y="100" width="10" height="10" fill="#353535" />
    <rect x="140" y="100" width="10" height="10" fill="#353535" />
    <rect x="170" y="100" width="10" height="10" fill="#353535" />
    <rect x="190" y="100" width="10" height="10" fill="#353535" />
    {/* Row 11 */}
    <rect x="90" y="110" width="10" height="10" fill="#353535" />
    <rect x="120" y="110" width="10" height="10" fill="#353535" />
    <rect x="150" y="110" width="10" height="10" fill="#353535" />
    <rect x="180" y="110" width="10" height="10" fill="#353535" />
    {/* Row 12 */}
    <rect x="80" y="120" width="10" height="10" fill="#353535" />
    <rect x="110" y="120" width="10" height="10" fill="#353535" />
    <rect x="130" y="120" width="10" height="10" fill="#353535" />
    <rect x="160" y="120" width="10" height="10" fill="#353535" />
    <rect x="200" y="120" width="10" height="10" fill="#353535" />
    {/* Row 13 */}
    <rect x="80" y="130" width="10" height="10" fill="#353535" />
    <rect x="100" y="130" width="10" height="10" fill="#353535" />
    <rect x="140" y="130" width="10" height="10" fill="#353535" />
    <rect x="170" y="130" width="10" height="10" fill="#353535" />
    {/* Row 14 */}
    <rect x="80" y="140" width="10" height="10" fill="#353535" />
    <rect x="120" y="140" width="10" height="10" fill="#353535" />
    <rect x="150" y="140" width="10" height="10" fill="#353535" />
    <rect x="190" y="140" width="10" height="10" fill="#353535" />
    {/* Row 15 */}
    <rect x="80" y="150" width="10" height="10" fill="#353535" />
    <rect x="110" y="150" width="10" height="10" fill="#353535" />
    <rect x="140" y="150" width="10" height="10" fill="#353535" />
    <rect x="170" y="150" width="10" height="10" fill="#353535" />
    <rect x="200" y="150" width="10" height="10" fill="#353535" />
    {/* Row 16 */}
    <rect x="80" y="160" width="10" height="10" fill="#353535" />
    <rect x="100" y="160" width="10" height="10" fill="#353535" />
    <rect x="130" y="160" width="10" height="10" fill="#353535" />
    <rect x="160" y="160" width="10" height="10" fill="#353535" />
    <rect x="190" y="160" width="10" height="10" fill="#353535" />
    {/* Row 17 */}
    <rect x="90" y="170" width="10" height="10" fill="#353535" />
    <rect x="120" y="170" width="10" height="10" fill="#353535" />
    <rect x="150" y="170" width="10" height="10" fill="#353535" />
    <rect x="180" y="170" width="10" height="10" fill="#353535" />
    {/* Row 18 */}
    <rect x="80" y="180" width="10" height="10" fill="#353535" />
    <rect x="110" y="180" width="10" height="10" fill="#353535" />
    <rect x="140" y="180" width="10" height="10" fill="#353535" />
    <rect x="170" y="180" width="10" height="10" fill="#353535" />
    <rect x="200" y="180" width="10" height="10" fill="#353535" />
    {/* Row 19 */}
    <rect x="80" y="190" width="10" height="10" fill="#353535" />
    <rect x="100" y="190" width="10" height="10" fill="#353535" />
    <rect x="130" y="190" width="10" height="10" fill="#353535" />
    <rect x="160" y="190" width="10" height="10" fill="#353535" />
    {/* Row 20 */}
    <rect x="90" y="200" width="10" height="10" fill="#353535" />
    <rect x="120" y="200" width="10" height="10" fill="#353535" />
    <rect x="150" y="200" width="10" height="10" fill="#353535" />
    <rect x="190" y="200" width="10" height="10" fill="#353535" />
  </svg>
);

export const TravelDayPage = () => {
  return (
    <div className="td-page">
      <HeaderBar fixed extraClasses="td-header">
        <Button
          appearance="link"
          aria-label="Back"
          extraClasses="td-header__back"
        >
          <Icon InlineIcon={IconArrowLeft} aria-hidden="true" />
          Back
        </Button>
        <Heading size={3} Elem="span" flushSpace extraClasses="td-header__title">
          My Trip
        </Heading>
        <span className="td-header__spacer" aria-hidden="true" />
      </HeaderBar>

      <main className="td-main">
        {/* Journey card */}
        <Box extraClasses="td-card">
          <div className="td-journey-meta">
            <Text small Elem="span" extraClasses="td-journey-date">
              Today, Thu 8 Oct
            </Text>
            <Tag appearance="success" display="subtle" small>
              On time
            </Tag>
          </div>

          <Connection appearance="success" extraClasses="td-connection">
            <ConnectionStop time="08:45" station="Berlin ZOB (Central Bus Station)" />
            <ConnectionSlot>
              <div className="td-connection-slot">
                <Icon
                  InlineIcon={IconBus}
                  size={3}
                  aria-hidden="true"
                  extraClasses="td-connection-slot__icon"
                />
                <Text small Elem="span">
                  FlixBus 1234 · direction Hamburg
                </Text>
              </div>
            </ConnectionSlot>
            <ConnectionStop time="14:20" station="Hamburg ZOB (Central Bus Station)" />
          </Connection>
        </Box>

        {/* Trip details */}
        <Box extraClasses="td-card">
          <Heading size={4} flushSpace extraClasses="td-section-title">
            Trip details
          </Heading>
          <ul className="td-detail-list" role="list">
            <li className="td-detail-row">
              <span className="td-detail-icon">
                <Icon InlineIcon={IconStation} size={4} aria-hidden="true" />
              </span>
              <Text small Elem="span" extraClasses="td-detail-label">
                Platform
              </Text>
              <Heading size={4} Elem="span" flushSpace extraClasses="td-detail-value">
                3
              </Heading>
            </li>
            <li className="td-detail-row">
              <span className="td-detail-icon">
                <Icon InlineIcon={IconBus} size={4} aria-hidden="true" />
              </span>
              <Text small Elem="span" extraClasses="td-detail-label">
                Bus line
              </Text>
              <Heading size={4} Elem="span" flushSpace extraClasses="td-detail-value">
                FlixBus 1234
              </Heading>
            </li>
            <li className="td-detail-row">
              <span className="td-detail-icon">
                <Icon InlineIcon={IconSeat} size={4} aria-hidden="true" />
              </span>
              <Text small Elem="span" extraClasses="td-detail-label">
                Seat
              </Text>
              <Heading size={4} Elem="span" flushSpace extraClasses="td-detail-value">
                Row 12, Seat A
              </Heading>
            </li>
          </ul>
        </Box>

        {/* Boarding QR card */}
        <Box highlighted extraClasses="td-card td-qr-card">
          <Heading size={4} flushSpace extraClasses="td-qr-title">
            Boarding pass
          </Heading>
          <Text small extraClasses="td-qr-subtitle">
            Show this code at Platform 3 to board
          </Text>
          <div className="td-qr-wrapper">
            <div className="td-qr-frame">
              <QrCodeSvg />
            </div>
          </div>
          <Text small extraClasses="td-qr-route">
            Berlin ZOB → Hamburg ZOB
          </Text>
        </Box>

        {/* Action buttons */}
        <div className="td-actions">
          <Button appearance="primary" display="block" size="lg">
            <Icon InlineIcon={IconPinLive} aria-hidden="true" />
            Track bus
          </Button>
          <Button display="block" size="lg">
            <Icon InlineIcon={IconDirections} aria-hidden="true" />
            Get directions to station
          </Button>
        </div>
      </main>
    </div>
  );
};
