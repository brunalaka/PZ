import React from 'react';
import { Button, Divider, Heading, Input, Radio, Text } from '@flixbus/honeycomb-react';
import { Icon, IconArrowLeftL, IconArrowRight, IconOffer, IconTime } from '@flixbus/honeycomb-icons-react';
import './checkout-page.css';

const ASSET = 'https://www.figma.com/api/mcp/asset/fd99b1a7-a335-4537-a39a-d382f7eee40f';
const imgSeatA = `${ASSET}/bdee4.svg`;
const imgSeatB = `${ASSET}/ec098.svg`;
const imgPerson = `${ASSET}/bbe77.svg`;
const imgVisaMC = `${ASSET}/68ae7.svg`;
const imgGPay = `${ASSET}/5cdaf.svg`;
const imgPayPal = `${ASSET}/ab9f0.svg`;

function StepBadge({ number }: { number: number }) {
  return (
    <div className="co-step-badge" aria-hidden="true">
      {number}
    </div>
  );
}

function SeatMapThumbnail() {
  return (
    <div className="co-seat-map" aria-hidden="true">
      <img src={imgSeatA} alt="" width={19} height={19} />
      <img src={imgSeatB} alt="" width={19} height={19} />
      <div className="co-seat-map__selected">
        <img src={imgPerson} alt="" width={8} height={8} />
      </div>
      <img src={imgSeatB} alt="" width={19} height={19} />
      <img src={imgSeatA} alt="" width={19} height={19} />
      <img src={imgSeatB} alt="" width={19} height={19} />
    </div>
  );
}

function PassengerForm({
  index,
  type,
  idPrefix,
  showDob = false,
}: {
  index: number;
  type: 'Adult' | 'Child';
  idPrefix: string;
  showDob?: boolean;
}) {
  return (
    <div className="co-passenger-form">
      <Text extraClasses="co-passenger-label">{index}. {type}</Text>
      <Input id={`${idPrefix}-first`} label="First name *" />
      <Input id={`${idPrefix}-last`} label="Last name *" />
      {showDob && <Input id={`${idPrefix}-dob`} label="Date of birth *" />}
    </div>
  );
}

function AncillaryOption({ title, price }: { title: string; price: string }) {
  return (
    <button type="button" className="co-ancillary-option">
      <SeatMapThumbnail />
      <div className="co-ancillary-text">
        <span className="co-ancillary-title">{title}</span>
        <Text Elem="span" small extraClasses="co-ancillary-price">{price}</Text>
      </div>
      <Icon InlineIcon={IconArrowRight} size={3} aria-hidden="true" extraClasses="co-ancillary-chevron" />
    </button>
  );
}

export function CheckoutPage() {
  return (
    <div className="co-page">
      <header className="co-header">
        <Button
          appearance="link"
          display="square"
          aria-label="Go back"
          extraClasses="co-header__back"
        >
          <Icon InlineIcon={IconArrowLeftL} aria-hidden="true" />
        </Button>
        <img
          className="co-header__logo"
          src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
          alt="FlixBus"
          width={110}
          height={20}
        />
        <div className="co-header__timer" aria-label="Time remaining: 9 minutes 56 seconds">
          <Icon InlineIcon={IconTime} size={4} aria-hidden="true" />
          <span className="co-timer-text">09:56</span>
        </div>
      </header>

      <main className="co-main">
        <section className="co-card" aria-labelledby="step-1-title">
          <div className="co-step-header">
            <StepBadge number={1} />
            <Heading size={2} Elem="h1" id="step-1-title" flushSpace>Passengers</Heading>
          </div>
          <div className="co-passengers">
            <PassengerForm index={1} type="Adult" idPrefix="pax1" />
            <PassengerForm index={2} type="Adult" idPrefix="pax2" />
            <PassengerForm index={3} type="Child" idPrefix="pax3" showDob />
          </div>
        </section>

        <section className="co-card" aria-labelledby="step-2-title">
          <div className="co-step-header">
            <StepBadge number={2} />
            <Heading size={2} Elem="h2" id="step-2-title" flushSpace>Seat reservation</Heading>
          </div>
          <div className="co-ancillaries">
            <AncillaryOption title="Select your seat" price="from 3,45 €" />
            <AncillaryOption title="Travel neighbour free" price="13,45 €" />
          </div>
        </section>

        <section className="co-card" aria-labelledby="step-3-title">
          <div className="co-step-header">
            <StepBadge number={3} />
            <Heading size={2} Elem="h2" id="step-3-title" flushSpace>Payment</Heading>
          </div>
          <fieldset className="co-payment-fieldset">
            <legend className="co-sr-only">Payment method</legend>
            <Radio
              id="pay-cards"
              name="payment"
              value="cards"
              extraClasses="co-payment-radio-row"
              label={
                <span className="co-payment-label">
                  <img src={imgVisaMC} alt="" aria-hidden="true" className="co-payment-logo" />
                  Cards
                </span>
              }
            />
            <Divider />
            <Radio
              id="pay-gpay"
              name="payment"
              value="gpay"
              extraClasses="co-payment-radio-row"
              label={
                <span className="co-payment-label">
                  <img src={imgGPay} alt="" aria-hidden="true" className="co-payment-logo" />
                  Google Pay
                </span>
              }
            />
            <Divider />
            <Radio
              id="pay-paypal"
              name="payment"
              value="paypal"
              extraClasses="co-payment-radio-row"
              label={
                <span className="co-payment-label">
                  <img src={imgPayPal} alt="" aria-hidden="true" className="co-payment-logo" />
                  PayPal
                </span>
              }
            />
          </fieldset>
          <Button appearance="link" extraClasses="co-billing-btn">
            <Icon InlineIcon={IconOffer} aria-hidden="true" />
            Add billing address (optional)
          </Button>
        </section>
      </main>
    </div>
  );
}
