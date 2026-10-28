import React, { useState } from 'react';
import {
  Box,
  Button,
  Connection,
  ConnectionSlot,
  ConnectionStop,
  Divider,
  Header,
  HeaderBrand,
  HeaderWidgets,
  Heading,
  Link,
  Tag,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowBigRight,
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconCrossed,
  IconOffer,
  IconRebook,
  IconSeat,
} from '@flixbus/honeycomb-icons-react';
import './my-trips.css';

export const MyTripsPage = () => {
  const [mmbExpanded, setMmbExpanded] = useState(false);

  return (
    <div className="ca-page">
      <Header
        brand={
          <HeaderBrand
            alt="FlixBus"
            href="/customer-account/my-trips"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          />
        }
        widgets={
          <HeaderWidgets>
            <Button appearance="link" aria-label="Account" extraClasses="ca-header-account-btn">
              JB
            </Button>
          </HeaderWidgets>
        }
      />

      <main className="ca-main">
        <Heading size={1} flushSpace extraClasses="ca-page-title">My Trips</Heading>

        <Button extraClasses="ca-find-booking-btn">
          <Icon InlineIcon={IconOffer} aria-hidden="true" />
          Find booking
        </Button>

        <Box extraClasses="ca-trip-card">
          {/* Route heading */}
          <div className="ca-trip-card__header">
            <div className="ca-trip-card__destination">
              <Heading size={2} Elem="span" flushSpace>Munich</Heading>
              <Icon InlineIcon={IconArrowBigRight} aria-hidden="true" size={3} />
              <Heading size={2} Elem="span" flushSpace>Zurich</Heading>
            </div>
            <Text small extraClasses="ca-trip-card__booking-number">
              Booking number: 9737723863
            </Text>
          </div>

          {/* Date and brand tag — stacked vertically */}
          <div className="ca-trip-card__details">
            <Heading size={3} Elem="h2" flushSpace>Fri, 6 Jan</Heading>
            <Tag small extraClasses="ca-flixbus-tag">FlixBus</Tag>
          </div>

          <Connection extraClasses="ca-trip-card__connection">
            <ConnectionStop station="Munich central bus station" time="07:00" />
            <ConnectionSlot>
              <Text small Elem="span" extraClasses="ca-trip-card__transfer">1 Transfer</Text>
            </ConnectionSlot>
            <ConnectionStop station="Zurich bus station" time="10:50" />
          </Connection>

          <Button appearance="primary" display="block" size="lg" extraClasses="ca-trip-card__cta">
            Trip details
          </Button>

          {/* Manage my booking accordion toggle */}
          <Button
            appearance="link"
            extraClasses="ca-mmb-toggle"
            onClick={() => setMmbExpanded((prev) => !prev)}
            aria-expanded={mmbExpanded}
          >
            <Icon InlineIcon={IconRebook} appearance="secondary" aria-hidden="true" />
            Manage my booking
            <Icon InlineIcon={mmbExpanded ? IconArrowUp : IconArrowDown} aria-hidden="true" />
          </Button>

          {mmbExpanded && (
            <div className="ca-mmb-options" role="group" aria-label="Manage my booking options">
              <Button display="stacked" extraClasses="ca-mmb-options__btn">
                <Icon InlineIcon={IconOffer} aria-hidden="true" />
                Add a return trip
              </Button>
              <Button display="stacked" extraClasses="ca-mmb-options__btn">
                <Icon InlineIcon={IconSeat} aria-hidden="true" />
                Change seat
              </Button>
              <Button display="stacked" extraClasses="ca-mmb-options__btn">
                <Icon InlineIcon={IconCalendar} aria-hidden="true" />
                Change date
              </Button>
              <Button display="stacked" extraClasses="ca-mmb-options__btn">
                <Icon InlineIcon={IconCrossed} aria-hidden="true" extraClasses="ca-mmb-cancel-icon" />
                Cancel trip
              </Button>
              <Button display="stacked" extraClasses="ca-mmb-options__btn">
                <Icon InlineIcon={IconRebook} aria-hidden="true" />
                More options
              </Button>
            </div>
          )}
        </Box>
      </main>

      <footer className="ca-footer">
        <Divider />
        <div className="ca-footer__content">
          <div className="ca-footer__link-row">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Passenger Rights</Link>
            <Link href="#">Legal Notice</Link>
          </div>
          <div className="ca-footer__link-row">
            <Link href="#">Change Cookie Settings</Link>
          </div>
          <Text small extraClasses="ca-footer__copyright">© 2026 Flix SE</Text>
        </div>
      </footer>
    </div>
  );
};
