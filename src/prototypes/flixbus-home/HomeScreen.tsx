import React, { useState } from 'react';
import {
  Box,
  Button,
  Connection,
  ConnectionStop,
  Header,
  HeaderBrand,
  HeaderWidgets,
  Heading,
  NavTabBar,
  NavTabBarItem,
  Tag,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconHome,
  IconHomeSolid,
  IconMagnifier,
  IconMagnifierSolid,
  IconTicket,
  IconTicketSolid,
  IconProfile,
  IconProfileSolid,
  IconBus,
  IconArrowBigRight,
  IconTime,
  IconOffer,
  IconStar,
  IconCalendar,
} from '@flixbus/honeycomb-icons-react';
import './HomeScreen.css';

type Filter = 'all' | 'trips' | 'deals' | 'popular';
type Tab = 'home' | 'search' | 'trips' | 'profile';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trips', label: 'My Trips' },
  { id: 'deals', label: 'Deals' },
  { id: 'popular', label: 'Popular' },
];

const POPULAR_ROUTES = [
  { from: 'Berlin', to: 'Munich', price: '€12', duration: '5h 45m' },
  { from: 'Hamburg', to: 'Berlin', price: '€9', duration: '3h 20m' },
  { from: 'Frankfurt', to: 'Cologne', price: '€7', duration: '2h 10m' },
  { from: 'Munich', to: 'Vienna', price: '€18', duration: '4h 30m' },
];

const DEALS = [
  { from: 'Berlin', to: 'Prague', price: '€15', was: '€25', discount: '40% off', until: 'Until Sunday' },
  { from: 'Paris', to: 'Brussels', price: '€12', was: '€20', discount: '40% off', until: 'Until Monday' },
  { from: 'Amsterdam', to: 'Brussels', price: '€10', was: '€18', discount: '44% off', until: 'Until Sunday' },
];

export const FlixbusHomeScreen = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const showTrips = activeFilter === 'all' || activeFilter === 'trips';
  const showPopular = activeFilter === 'all' || activeFilter === 'popular';
  const showDeals = activeFilter === 'all' || activeFilter === 'deals';

  return (
    <div className="fh-page">
      <Header
        fixed
        extraClasses="fh-header"
        brand={
          <HeaderBrand
            alt="FlixBus"
            href="/flixbus-home"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          />
        }
        widgets={
          <HeaderWidgets>
            <button className="fh-header-icon-btn" aria-label="Account">
              <Icon InlineIcon={IconProfileSolid} aria-hidden="true" size={4} />
            </button>
          </HeaderWidgets>
        }
      />

      <main className="fh-main" id="main-content">

        {/* Greeting */}
        <div className="fh-greeting">
          <Heading size={2} flushSpace>Good morning, Sam</Heading>
          <Text small extraClasses="fh-greeting__sub">Where are you heading next?</Text>
        </div>

        {/* Filter chips */}
        <div className="fh-filters" role="group" aria-label="Filter content">
          <div className="fh-filters__inner">
            {FILTERS.map((f) => (
              <Tag
                key={f.id}
                Elem="button"
                appearance={activeFilter === f.id ? 'selected' : undefined}
                onClick={() => setActiveFilter(f.id)}
                extraClasses="fh-filter-chip"
              >
                {f.label}
              </Tag>
            ))}
          </div>
        </div>

        {/* Upcoming trip */}
        {showTrips && (
          <section className="fh-section" aria-label="Your upcoming trip">
            <Heading size={3} flushSpace extraClasses="fh-section__title">Your upcoming trip</Heading>
            <Box extraClasses="fh-trip-card">
              <div className="fh-trip-card__meta">
                <div className="fh-trip-card__route">
                  <Heading size={2} Elem="span" flushSpace>Berlin</Heading>
                  <Icon InlineIcon={IconArrowBigRight} aria-hidden="true" size={3} extraClasses="fh-trip-card__arrow" />
                  <Heading size={2} Elem="span" flushSpace>Amsterdam</Heading>
                </div>
                <Tag appearance="success" small>Confirmed</Tag>
              </div>

              <div className="fh-trip-card__info-row">
                <Icon InlineIcon={IconCalendar} aria-hidden="true" size={3} extraClasses="fh-trip-info-icon" />
                <Text small>Sat, 25 Oct 2025</Text>
              </div>

              <Connection extraClasses="fh-trip-card__connection">
                <ConnectionStop station="Berlin Central Bus Station" time="08:35" />
                <ConnectionStop station="Amsterdam Sloterdijk" time="18:05" />
              </Connection>

              <Text small extraClasses="fh-trip-card__booking-ref">
                Booking ref: <strong>4B72K9</strong>
              </Text>

              <div className="fh-trip-card__ctas">
                <Button extraClasses="fh-trip-card__cta-primary">
                  <Icon InlineIcon={IconTicket} aria-hidden="true" />
                  View ticket
                </Button>
                <Button appearance="link" extraClasses="fh-trip-card__cta-link">
                  Manage booking
                </Button>
              </div>
            </Box>
          </section>
        )}

        {/* Popular routes */}
        {showPopular && (
          <section className="fh-section" aria-label="Popular routes">
            <div className="fh-section__header">
              <Heading size={3} flushSpace extraClasses="fh-section__title">Popular routes</Heading>
            </div>
            <div className="fh-scroll-row" role="list">
              {POPULAR_ROUTES.map((route) => (
                <div
                  key={`${route.from}-${route.to}`}
                  role="listitem"
                  className="fh-route-card-wrapper"
                >
                  <Box extraClasses="fh-route-card">
                    <div className="fh-route-card__icon-row">
                      <Icon InlineIcon={IconBus} aria-hidden="true" size={3} extraClasses="fh-route-card__bus-icon" />
                    </div>
                    <div className="fh-route-card__route">
                      <Text small extraClasses="fh-route-card__from">{route.from}</Text>
                      <Icon InlineIcon={IconArrowBigRight} aria-hidden="true" size={2} extraClasses="fh-route-card__arrow" />
                      <Text small extraClasses="fh-route-card__to">{route.to}</Text>
                    </div>
                    <Heading size={2} flushSpace extraClasses="fh-route-card__price">{route.price}</Heading>
                    <div className="fh-route-card__duration-row">
                      <Icon InlineIcon={IconTime} aria-hidden="true" size={2} extraClasses="fh-route-info-icon" />
                      <Text small extraClasses="fh-route-card__duration">{route.duration}</Text>
                    </div>
                  </Box>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deals */}
        {showDeals && (
          <section className="fh-section" aria-label="Deals this week">
            <div className="fh-section__header">
              <Heading size={3} flushSpace extraClasses="fh-section__title">Deals this week</Heading>
              <Button appearance="link" extraClasses="fh-section__see-all">See all</Button>
            </div>
            <div className="fh-scroll-row" role="list">
              {DEALS.map((deal) => (
                <div
                  key={`${deal.from}-${deal.to}`}
                  role="listitem"
                  className="fh-deal-card-wrapper"
                >
                  <Box extraClasses="fh-deal-card">
                    <div className="fh-deal-card__tags">
                      <Tag appearance="success" small>{deal.discount}</Tag>
                    </div>
                    <div className="fh-deal-card__route">
                      <Text small extraClasses="fh-deal-card__city">{deal.from}</Text>
                      <Icon InlineIcon={IconArrowBigRight} aria-hidden="true" size={2} extraClasses="fh-route-card__arrow" />
                      <Text small extraClasses="fh-deal-card__city">{deal.to}</Text>
                    </div>
                    <div className="fh-deal-card__pricing">
                      <Heading size={2} flushSpace extraClasses="fh-deal-card__price">{deal.price}</Heading>
                      <Text small extraClasses="fh-deal-card__was">{deal.was}</Text>
                    </div>
                    <div className="fh-deal-card__until-row">
                      <Icon InlineIcon={IconOffer} aria-hidden="true" size={2} extraClasses="fh-route-info-icon" />
                      <Text small extraClasses="fh-deal-card__until">{deal.until}</Text>
                    </div>
                  </Box>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state when no sections match */}
        {!showTrips && !showPopular && !showDeals && (
          <div className="fh-empty">
            <Icon InlineIcon={IconStar} aria-hidden="true" size={8} extraClasses="fh-empty__icon" />
            <Heading size={3} flushSpace>Nothing here yet</Heading>
            <Text small>Check back soon for updates in this category.</Text>
          </div>
        )}
      </main>

      <NavTabBar aria-label="Main navigation" extraClasses="fh-bottom-nav">
        <NavTabBarItem
          InlineIcon={IconHome}
          InlineIconActive={IconHomeSolid}
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </NavTabBarItem>
        <NavTabBarItem
          InlineIcon={IconMagnifier}
          InlineIconActive={IconMagnifierSolid}
          active={activeTab === 'search'}
          onClick={() => setActiveTab('search')}
        >
          Search
        </NavTabBarItem>
        <NavTabBarItem
          InlineIcon={IconTicket}
          InlineIconActive={IconTicketSolid}
          active={activeTab === 'trips'}
          onClick={() => setActiveTab('trips')}
        >
          My Trips
        </NavTabBarItem>
        <NavTabBarItem
          InlineIcon={IconProfile}
          InlineIconActive={IconProfileSolid}
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </NavTabBarItem>
      </NavTabBar>
    </div>
  );
};
