import {
  faFacebookSquare,
  faTwitterSquare
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from 'components/common/Logo';
import { PropsWithChildren } from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import Link from 'next/link';

const LinkItem = ({ children, to }: PropsWithChildren<{ to: string }>) => {
  return (
    <Link href={to} className="text-body-tertiary fw-semibold fs-9 mb-1">
      {children}
    </Link>
  );
};

const EcommerceFooter = () => {
  return (
    <section className="bg-body-highlight dark__bg-gray-1100 py-9">
      <div className="container-small">
        <Row className="justify-content-between gy-4">
          <Col xs={12} lg={4}>
            <Logo className="mb-3" />
            <p className="text-body-tertiary mb-1 fw-semibold lh-sm fs-9">
              Phoenix is an admin dashboard template with fascinating features
              and amazing layout. The template is responsive to all major
              browsers and is compatible with all available devices and screen
              sizes.
            </p>
          </Col>
          <Col xs={6} md="auto">
            <h5 className="fw-bolder mb-3">About Phoenix</h5>
            <Stack>
              <LinkItem href="#!">Careers</LinkItem>
              <LinkItem href="#!">Affiliate Program</LinkItem>
              <LinkItem href="#!">Privacy Policy</LinkItem>
              <LinkItem href="#!">Terms & Conditions</LinkItem>
            </Stack>
          </Col>
          <Col xs={6} md="auto">
            <h5 className="fw-bolder mb-3">Stay Connected</h5>
            <Stack>
              <LinkItem href="#!">Blogs</LinkItem>
              <Link href="#!" className="mb-1 fw-semibold fs-9">
                <FontAwesomeIcon
                  icon={faFacebookSquare}
                  className="text-primary me-2 fs-8"
                />
                <span className="text-body-secondary">Facebook</span>
              </Link>
              <Link href="#!" className="mb-1 fw-semibold fs-9">
                <FontAwesomeIcon
                  icon={faTwitterSquare}
                  className="text-info me-2 fs-8"
                />
                <span className="text-body-secondary">Twitter</span>
              </Link>
            </Stack>
          </Col>
          <Col xs={6} md="auto">
            <h5 className="fw-bolder mb-3">Customer Service</h5>
            <Stack>
              <LinkItem href="#!">Help Desk</LinkItem>
              <LinkItem href="#!">Support, 24/7</LinkItem>
              <LinkItem href="#!">Community of Phoenix</LinkItem>
            </Stack>
          </Col>
          <Col xs={6} md="auto">
            <h5 className="fw-bolder mb-3">Payment Method</h5>
            <Stack>
              <LinkItem href="#!">Cash on Delivery</LinkItem>
              <LinkItem href="#!">Online Payment</LinkItem>
              <LinkItem href="#!">PayPal</LinkItem>
              <LinkItem href="#!">Installment</LinkItem>
            </Stack>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default EcommerceFooter;


