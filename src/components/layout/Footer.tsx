import { NavLink } from 'react-router-dom'
import styles from './Footer.module.css'

const consultancyLinks = [
  { label: 'Leadership Development', to: '/consultancy' },
  { label: 'Corporate Training',     to: '/consultancy' },
  { label: 'Talent Search',          to: '/consultancy' },
  { label: 'Coaching & Mentorship',  to: '/consultancy' },
  { label: 'Org Transformation',     to: '/consultancy' },
]

const tradingLinks = [
  { label: 'Electric Vehicles',        to: '/trading' },
  { label: 'Construction Machinery',   to: '/trading' },
  { label: 'Sanitary Products',        to: '/trading' },
  { label: 'Medical Equipment',        to: '/trading' },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.container}>

        {/* Col 1 — Brand */}
        <div className={styles.brand}>
          <NavLink to="/">
            <img src="/logo.png" alt="Antra Business Group" className={styles.logo} />
          </NavLink>
          <p className={styles.tagline}>
            Enabling Growth<br />and Transformation.
          </p>
          <p className={styles.location}>
            Addis Ababa, Ethiopia
          </p>
        </div>

        {/* Col 2 — Consultancy */}
        <div className={styles.col}>
          <h5 className={styles.colTitle}>Consultancy</h5>
          <ul className={styles.linkList}>
            {consultancyLinks.map(l => (
              <li key={l.label}>
                <NavLink to={l.to} className={styles.footerLink}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Trading */}
        <div className={styles.col}>
          <h5 className={styles.colTitle}>Trading</h5>
          <ul className={styles.linkList}>
            {tradingLinks.map(l => (
              <li key={l.label}>
                <NavLink to={l.to} className={styles.footerLink}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div className={styles.col}>
          <h5 className={styles.colTitle}>Contact</h5>
          <ul className={styles.contactList}>
            <li>
              <span className={styles.contactLabel}>Phone</span>
              <a href="tel:+251951779777" className={styles.footerLink}>+251 951 77 97 77</a>
              <a href="tel:+251986111811" className={styles.footerLink}>+251 986 11 18 11</a>
            </li>
            <li>
              <span className={styles.contactLabel}>Email</span>
              <a href="mailto:info@antragroup.et" className={styles.footerLink}>info@antragroup.et</a>
            </li>
            <li>
              <span className={styles.contactLabel}>Address</span>
              {/* TODO(client): confirm sub-city — Kirkos vs. Bole — and street address per doc note #1 */}
              <span className={styles.address}>
                Africa Avenue, Rayuma Building,<br />
                Office 912, Bole Sub-City,<br />
                Addis Ababa, Ethiopia
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Antra Business Group Plc. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <NavLink to="/about" className={styles.bottomLink}>About</NavLink>
            <NavLink to="/contact" className={styles.bottomLink}>Contact</NavLink>
          </div>
          <p className={styles.madeBy}>
            Made by{' '}
            <a href="https://wubsites.com" target="_blank" rel="noopener noreferrer" className={styles.madeByLink}>
              Wubsites
            </a>
            {' '}<span className={styles.heart}>♥</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
