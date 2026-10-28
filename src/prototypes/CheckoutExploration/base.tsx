import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Connection,
  ConnectionStop,
  Divider,
  Flag,
  Heading,
  Input,
  PhoneInput,
  Quantity,
  Radio,
  Tag,
  Text,
} from '@flixbus/honeycomb-react';
import {
  Icon,
  IconArrowLeftL,
  IconArrowRight,
  IconArrowRightL,
  IconInfo,
  IconMap,
  IconOffer,
  IconQuestion,
} from '@flixbus/honeycomb-icons-react';
import seatSelectImg from './assets/seat-select.png';
import seatFreeImg from './assets/seat-free.png';
import vehicleFlixbusImg from './assets/vehicle-flixbus.png';
import luggageIncludedImg from './assets/luggage-included.svg';
import luggageAdditionalImg from './assets/luggage-additional.svg';
import luggageSpecialImg from './assets/luggage-special.svg';
import payCreditCardsImg from './assets/pay-credit-cards.svg';
import payGooglePayImg from './assets/pay-google-pay.svg';
import payPayPalImg from './assets/pay-paypal.svg';
import payApplePayImg from './assets/pay-apple-pay.svg';
import payRevolutPayImg from './assets/pay-revolut-pay.svg';
import payKlarnaImg from './assets/pay-klarna.svg';
import footerDesktopImg from '@flixbus/honeycomb/dist/img/footer-bus-and-train.svg';
import footerMobileImg from '@flixbus/honeycomb/dist/img/footer-bus-and-train-mobile.svg';
import './base.css';

const CALLING_CODES = [
  { value: '+43', countryCode: 'at', country: 'Austria' },
  { value: '+32', countryCode: 'be', country: 'Belgium' },
  { value: '+45', countryCode: 'dk', country: 'Denmark' },
  { value: '+33', countryCode: 'fr', country: 'France' },
  { value: '+49', countryCode: 'de', country: 'Germany' },
  { value: '+39', countryCode: 'it', country: 'Italy' },
  { value: '+31', countryCode: 'nl', country: 'Netherlands' },
  { value: '+48', countryCode: 'pl', country: 'Poland' },
  { value: '+34', countryCode: 'es', country: 'Spain' },
  { value: '+41', countryCode: 'ch', country: 'Switzerland' },
];

const TimerCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM5.5 12C5.5 15.5899 8.41015 18.5 12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12Z" fill="var(--hcr-line-primary-color,#c8c8c8)"/>
    <path d="M12 2C14.2534 2 16.4408 2.76109 18.2075 4.15988C19.9742 5.55868 21.2166 7.51317 21.7334 9.70651C22.2503 11.8999 22.0111 14.2035 21.0548 16.2439C20.0985 18.2843 18.481 19.9419 16.4647 20.948C14.4484 21.9541 12.1513 22.2496 9.94595 21.7868C7.7406 21.3239 5.75621 20.1298 4.3145 18.3979C2.8728 16.666 2.05828 14.498 2.00301 12.2453C1.94774 9.99256 2.65494 7.78719 4.00998 5.98672L6.80649 8.09137C5.92571 9.26168 5.46603 10.6952 5.50196 12.1594C5.53788 13.6237 6.06732 15.0329 7.00443 16.1586C7.94154 17.2843 9.23139 18.0605 10.6649 18.3614C12.0984 18.6623 13.5914 18.4701 14.9021 17.8162C16.2127 17.1622 17.264 16.0848 17.8856 14.7585C18.5072 13.4322 18.6627 11.9349 18.3267 10.5092C17.9908 9.08356 17.1832 7.81314 16.0348 6.90392C14.8865 5.99471 13.4647 5.5 12 5.5V2Z" fill="var(--hcr-ui-primary-color,#31a100)"/>
  </svg>
);



function StepBadge({ number }: { number: number }) {
  return (
    <div className="cxb-step-badge" aria-hidden="true">{number}</div>
  );
}

type InputProps = React.ComponentProps<typeof Input>;

function TrackedInput(props: InputProps) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  return (
    <Input
      {...props}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      onBlur={() => setTouched(true)}
      valid={touched && value.length > 0 ? true : undefined}
    />
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
    <div className="cxb-passenger-form">
      <Text extraClasses="cxb-passenger-label">{index}. {type}</Text>
      <TrackedInput id={`${idPrefix}-first`} label="First name *" />
      <TrackedInput id={`${idPrefix}-last`} label="Last name *" />
      {showDob && (
        <TrackedInput id={`${idPrefix}-dob`} label="Date of birth *" placeholder="DD/MM/YYYY" />
      )}
    </div>
  );
}

function SeatOption({
  title,
  price,
  img,
  imgAlt,
}: {
  title: string;
  price: string;
  img: string;
  imgAlt: string;
}) {
  return (
    <button type="button" className="cxb-seat-option">
      <img src={img} alt={imgAlt} className="cxb-seat-thumbnail" />
      <div className="cxb-seat-text">
        <span className="cxb-seat-title">{title}</span>
        <Text Elem="span" small extraClasses="cxb-seat-price">{price}</Text>
      </div>
      <Icon InlineIcon={IconArrowRightL} size={3} aria-hidden="true" extraClasses="cxb-seat-chevron" />
    </button>
  );
}

interface OrderSummaryProps {
  tcAccepted: boolean;
  onTcChange: (v: boolean) => void;
  idSuffix: string;
}

function OrderSummary({ tcAccepted, onTcChange, idSuffix }: OrderSummaryProps) {
  const [voucherOpen, setVoucherOpen] = useState(false);

  return (
    <div className="cxb-booking-block">
      {/* Cart card: heading + trip card + price breakdown card */}
      <div className="cxb-summary-card">
        <div className="cxb-summary-header">
          <Heading size={3} Elem="h2" flushSpace>Your Booking</Heading>
          <div className="cxb-summary-timer" aria-label="Time remaining: 9 minutes 56 seconds">
            <TimerCircle />
            <span className="cxb-timer-text">09:56</span>
          </div>
        </div>

        <div className="cxb-trip-card">
          <div className="cxb-trip-header">
            <div className="cxb-trip-header-left">
              <p className="cxb-trip-date">Fri, 15 Nov</p>
              <div className="cxb-trip-tags">
                <Tag small extraClasses="cxb-brand-tag">FlixBus</Tag>
              </div>
            </div>
            <img src={vehicleFlixbusImg} alt="" aria-hidden="true" className="cxb-bus-illustration" />
          </div>
          <Connection>
            <ConnectionStop
              time="08:30"
              station={
                <span className="cxb-stop-name">
                  Berlin Central Bus Station
                  <Icon InlineIcon={IconMap} size={3} aria-hidden="true" extraClasses="cxb-stop-icon" />
                </span>
              }
            />
            <ConnectionStop
              time="16:45"
              station={
                <span className="cxb-stop-name">
                  Amsterdam Sloterdijk
                  <Icon InlineIcon={IconMap} size={3} aria-hidden="true" extraClasses="cxb-stop-icon" />
                </span>
              }
            />
          </Connection>
          <p className="cxb-direct-trip">DIRECT TRIP</p>
        </div>

        {/* Price breakdown card — separate bordered card inside the outer cart card */}
        <div className="cxb-price-card">
          <div className="cxb-price-row cxb-total-row">
            <span className="cxb-total-label">
              <strong>Total</strong> <span className="cxb-total-vat">(incl. VAT)</span>
            </span>
            <span className="cxb-total-amount">€75.97</span>
          </div>
          <Divider />
          <div className="cxb-price-breakdown">
            <div className="cxb-price-row">
              <p className="cxb-price-item-label">2 Adults</p>
              <p className="cxb-price-value">€49.98</p>
            </div>
          </div>
          <Divider />
          <div className="cxb-price-row">
            <span className="cxb-service-fee-label">
              <span className="cxb-price-service-text">Service fee</span>
              <Icon InlineIcon={IconInfo} size={3} aria-label="Service fee information" extraClasses="cxb-info-icon" />
            </span>
            <p className="cxb-price-value">€0.00</p>
          </div>
        </div>
      </div>

      {/* Outside the cart card */}
      <div className="cxb-voucher-section">
        <button
          type="button"
          className="cxb-voucher-toggle"
          onClick={() => setVoucherOpen(o => !o)}
          aria-expanded={voucherOpen}
        >
          <Icon InlineIcon={IconOffer} size={4} aria-hidden="true" extraClasses="cxb-voucher-icon" />
          Enter Voucher
          <span className={`cxb-voucher-chevron${voucherOpen ? ' cxb-voucher-chevron--open' : ''}`}>▾</span>
        </button>
        {voucherOpen && (
          <div className="cxb-voucher-input-row">
            <Input id={`voucher-${idSuffix}`} label="Voucher code" extraClasses="cxb-voucher-input" />
            <Button extraClasses="cxb-voucher-apply-btn">Apply</Button>
          </div>
        )}
      </div>

      <Checkbox
        id={`tc-accept-${idSuffix}`}
        label={
          <span>
            I declare to have read the{' '}
            <a href="#" className="cxb-inline-link">Privacy Policy</a>
            {' '}and I agree to the{' '}
            <a href="#" className="cxb-inline-link">T&amp;C of Booking</a>
            {' '}and{' '}
            <a href="#" className="cxb-inline-link">T&amp;C of Carriage</a>.
          </span>
        }
        checked={tcAccepted}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTcChange(e.target.checked)}
      />

      <Button appearance="primary" extraClasses="cxb-pay-btn">
        Pay now
      </Button>
    </div>
  );
}

export function CheckoutExplorationBase() {
  const [paymentMethod, setPaymentMethod] = useState('cards');
  const [tcAccepted, setTcAccepted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const progress = root.scrollTop / (root.scrollHeight - root.clientHeight) * 100;
      setScrollProgress(Math.min(100, progress || 0));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="cxb-page">
      <header className="cxb-header">
        <div className="cxb-header-bar">
          <Button
            appearance="link"
            display="square"
            aria-label="Go back"
            extraClasses="cxb-header-back"
          >
            <Icon InlineIcon={IconArrowLeftL} aria-hidden="true" />
          </Button>
          <img
            className="cxb-header-logo"
            src="https://honeycomb.flixbus.com/dist/7.2.13/img/logos/svg/flixbus-white.svg"
            alt="FlixBus"
            width={110}
            height={20}
          />
          <div className="cxb-header-timer" aria-label="Time remaining: 9 minutes 56 seconds">
            <TimerCircle />
            <span className="cxb-timer-text">09:56</span>
          </div>
        </div>
      </header>
      <div className="cxb-header-trip" aria-hidden="true">
        <div className="cxb-header-trip-card">
          <div className="cxb-header-trip-route">
            <span className="cxb-header-trip-city">Berlin Central Bus Station</span>
            <Icon InlineIcon={IconArrowRight} size={3} aria-hidden="true" extraClasses="cxb-header-trip-arrow" />
            <span className="cxb-header-trip-city">Amsterdam Sloterdijk</span>
          </div>
          <p className="cxb-header-trip-meta">Fri, 15 Nov · 08:30 – 16:45</p>
        </div>
      </div>
      <div className="cxb-progress-bar" aria-hidden="true">
        <div className="cxb-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="cxb-layout">
        <main className="cxb-main">
          <section className="cxb-card" aria-labelledby="step-1-title">
            <div className="cxb-step-header">
              <StepBadge number={1} />
              <Heading size={2} Elem="h2" id="step-1-title" flushSpace>Passengers</Heading>
            </div>
            <div className="cxb-passengers">
              <PassengerForm index={1} type="Adult" idPrefix="pax1" />
            </div>
          </section>

          <section className="cxb-card" aria-labelledby="step-2-title">
            <div className="cxb-step-header">
              <StepBadge number={2} />
              <Heading size={2} Elem="h2" id="step-2-title" flushSpace>Seat reservation</Heading>
            </div>
            <div className="cxb-seat-options">
              <SeatOption
                title="Select your seat"
                price="from €3.45"
                img={seatSelectImg}
                imgAlt="Seat map with one seat selected"
              />
              <SeatOption
                title="Travel neighbour free"
                price="€13.45"
                img={seatFreeImg}
                imgAlt="Empty neighbouring seat"
              />
            </div>
          </section>

          <section className="cxb-card" aria-labelledby="step-3-title">
            <div className="cxb-step-header">
              <StepBadge number={3} />
              <Heading size={2} Elem="h2" id="step-3-title" flushSpace>Extras</Heading>
            </div>
            <div className="cxb-extras">
              {/* Row 1: Included — static, no quantity */}
              <div className="cxb-luggage-row cxb-luggage-row--included">
                <img src={luggageIncludedImg} alt="" aria-hidden="true" className="cxb-luggage-icon" />
                <div className="cxb-luggage-info">
                  <p className="cxb-luggage-title">Included per person</p>
                  <p className="cxb-luggage-detail">1 Hand Luggage | 7 kg · 42×30×18 cm</p>
                  <p className="cxb-luggage-detail">1 Hold Luggage | 20 kg · 80×50×30 cm</p>
                </div>
              </div>
              {/* Row 2: Additional luggage */}
              <div className="cxb-luggage-row cxb-luggage-row--middle">
                <img src={luggageAdditionalImg} alt="" aria-hidden="true" className="cxb-luggage-icon" />
                <div className="cxb-luggage-body">
                  <div className="cxb-luggage-info">
                    <p className="cxb-luggage-title">Additional luggage</p>
                    <span className="cxb-luggage-detail-inline">
                      <span className="cxb-luggage-detail">23 kg · 80×50×30 cm</span>
                      <Icon InlineIcon={IconInfo} size={3} aria-label="Luggage information" extraClasses="cxb-luggage-info-icon" />
                    </span>
                  </div>
                  <div className="cxb-luggage-controls">
                    <span className="cxb-luggage-price">+ €7.90</span>
                    <Quantity id="qty-cabin" label="Additional luggage" value={0} min={0} max={3} inline />
                  </div>
                </div>
              </div>
              {/* Row 3: Special luggage */}
              <div className="cxb-luggage-row cxb-luggage-row--last">
                <img src={luggageSpecialImg} alt="" aria-hidden="true" className="cxb-luggage-icon" />
                <div className="cxb-luggage-body">
                  <div className="cxb-luggage-info">
                    <p className="cxb-luggage-title">Special luggage</p>
                    <span className="cxb-luggage-detail-inline">
                      <span className="cxb-luggage-detail">30 kg · 240 cm (x+y+z)</span>
                      <Icon InlineIcon={IconInfo} size={3} aria-label="Special luggage information" extraClasses="cxb-luggage-info-icon" />
                    </span>
                  </div>
                  <div className="cxb-luggage-controls">
                    <span className="cxb-luggage-price">+ €19.90</span>
                    <Quantity id="qty-large" label="Special luggage" value={0} min={0} max={2} inline />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cxb-card" aria-labelledby="step-4-title">
            <div className="cxb-step-header">
              <StepBadge number={4} />
              <Heading size={2} Elem="h2" id="step-4-title" flushSpace>Contact details</Heading>
            </div>
            <div className="cxb-contact-fields">
              <TrackedInput id="contact-email" label="Email address *" type="email" />
              <PhoneInput
                id="contact-phone"
                label="Phone number (optional)"
                callingCodes={CALLING_CODES}
                defaultCountryCode="de"
                selectLabel="Select country code"
                selectAddOnSm
                selectAddOn={(code, countryCode, country) =>
                  code
                    ? <Flag countryCode={countryCode} countryName={country} style={{ verticalAlign: 'middle' }} />
                    : <Icon InlineIcon={IconQuestion} size={4} aria-hidden="true" />
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneValue(e.target.value)}
                onBlur={() => setPhoneTouched(true)}
                valid={phoneTouched && phoneValue.length > 0 ? true : undefined}
              />
            </div>
          </section>

          <section className="cxb-card" aria-labelledby="step-5-title">
            <div className="cxb-step-header">
              <StepBadge number={5} />
              <Heading size={2} Elem="h2" id="step-5-title" flushSpace>Payment</Heading>
            </div>
            <fieldset className="cxb-payment-fieldset">
              <legend className="cxb-sr-only">Payment method</legend>
              <Radio
                id="pay-cards"
                name="payment"
                value="cards"
                checked={paymentMethod === 'cards'}
                onChange={() => setPaymentMethod('cards')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'cards' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payCreditCardsImg} alt="Credit / Debit cards" className="cxb-payment-logo" />
                    Credit / Debit card
                  </span>
                }
              />
              {paymentMethod === 'cards' && (
                <div className="cxb-card-fields">
                  <TrackedInput id="card-number" label="Card number *" placeholder="1234 1234 1234 1234" />
                  <div className="cxb-card-row-2">
                    <TrackedInput id="card-expiry" label="Expiry date *" placeholder="MM/YY" />
                    <TrackedInput id="card-cvc" label="CVC *" placeholder="CVV" />
                  </div>
                  <TrackedInput id="card-holder" label="Card holder name *" placeholder="Card Holder Name" />
                </div>
              )}
              <Divider />
              <Radio
                id="pay-gpay"
                name="payment"
                value="gpay"
                checked={paymentMethod === 'gpay'}
                onChange={() => setPaymentMethod('gpay')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'gpay' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payGooglePayImg} alt="Google Pay" className="cxb-payment-logo" />
                    Google Pay
                  </span>
                }
              />
              <Divider />
              <Radio
                id="pay-paypal"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'paypal' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payPayPalImg} alt="PayPal" className="cxb-payment-logo" />
                    PayPal
                  </span>
                }
              />
              <Divider />
              <Radio
                id="pay-applepay"
                name="payment"
                value="applepay"
                checked={paymentMethod === 'applepay'}
                onChange={() => setPaymentMethod('applepay')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'applepay' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payApplePayImg} alt="Apple Pay" className="cxb-payment-logo" />
                    Apple Pay
                  </span>
                }
              />
              <Divider />
              <Radio
                id="pay-revolut"
                name="payment"
                value="revolut"
                checked={paymentMethod === 'revolut'}
                onChange={() => setPaymentMethod('revolut')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'revolut' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payRevolutPayImg} alt="Revolut Pay" className="cxb-payment-logo" />
                    Revolut Pay
                  </span>
                }
              />
              <Divider />
              <Radio
                id="pay-klarna"
                name="payment"
                value="klarna"
                checked={paymentMethod === 'klarna'}
                onChange={() => setPaymentMethod('klarna')}
                extraClasses={`cxb-payment-radio${paymentMethod === 'klarna' ? ' cxb-payment-radio--selected' : ''}`}
                label={
                  <span className="cxb-payment-label">
                    <img src={payKlarnaImg} alt="Klarna" className="cxb-payment-logo" />
                    Klarna
                  </span>
                }
              />
            </fieldset>
            <Button appearance="link" extraClasses="cxb-billing-btn">
              <Icon InlineIcon={IconOffer} size={4} aria-hidden="true" extraClasses="cxb-billing-icon" />
              Add billing address (optional)
            </Button>
          </section>

          <div className="cxb-order-mobile">
            <OrderSummary tcAccepted={tcAccepted} onTcChange={setTcAccepted} idSuffix="mobile" />
          </div>
        </main>

        <aside className="cxb-sidebar">
          <div className="cxb-sidebar-sticky">
            <OrderSummary tcAccepted={tcAccepted} onTcChange={setTcAccepted} idSuffix="desktop" />
          </div>
        </aside>
      </div>

      <div className="cxb-contract">
        <Text small extraClasses="cxb-contract-text">
          Contract partner for transportation services: FlixBus DACH GmbH (Munich central bus station - Berlin central bus station), FlixBus DACH GmbH (Berlin central bus station - Hamburg ZOB)
Privacy Policy.
        </Text>
      </div>

      <footer className="cxb-footer">
        <picture>
          <source media="(max-width: 767px)" srcSet={footerMobileImg} />
          <img src={footerDesktopImg} alt="" aria-hidden="true" className="cxb-footer-illustration" />
        </picture>
        <div className="cxb-footer-bar">
          <nav className="cxb-footer-nav" aria-label="Footer navigation">
            <a href="#" className="cxb-footer-link">Privacy Policy</a>
            <a href="#" className="cxb-footer-link">Passenger Rights</a>
            <a href="#" className="cxb-footer-link">Legal Notice</a>
            <a href="#" className="cxb-footer-link">Change Cookie Settings</a>
            <span className="cxb-footer-copy">© 2026 Flix SE</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
