// ===== AdminNavbar.jsx =====

import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Navbar, Container, Nav, Dropdown, Button, Form, InputGroup, Image } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AuthContext } from '../../contexts/AuthProvider'
import styles from './AdminNavbar.module.css'

// Séparation en deux lignes : on slice NAV_ITEMS
const NAV_ITEMS = [
  { href: '/admin/products', icon: 'icofont-box', label: 'Produits' },
  { href: '/admin/categories', icon: 'icofont-listine-dots', label: 'Catégories' },
  { href: '/admin/orders', icon: 'icofont-cart', label: 'Commandes' },
  { href: '/admin/shipping', icon: 'icofont-truck', label: 'Livraisons' },
  { href: '/admin/sellers', icon: 'icofont-business-man', label: 'Vendeurs' },
  { href: '/admin/shops', icon: 'icofont-shop', label: 'Boutiques' },
  { href: '/admin/advertisements', icon: 'icofont-megaphone', label: 'Publicités' },
  { href: '/admin/promotions', icon: 'icofont-sale-discount', label: 'Promotions' },
  { href: '/admin/customers', icon: 'icofont-users-alt-3', label: 'Clients' },
  { href: '/admin/blog', icon: 'icofont-blogger', label: 'Blog' },
  { href: '/admin/reports', icon: 'icofont-chart-line', label: 'Rapports' },
  { href: '/admin/settings', icon: 'icofont-gear', label: 'Paramètres' },
  { href: '/admin/sponsors', icon: 'icofont-sponsor', label: 'Sponsors' }
]

export default function AdminNavbar() {
  const router = useRouter()
  const { user, logOut } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Effet de scroll pour style transparent
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Helpers
  const isActive = useMemo(() => path => router.pathname === path, [router.pathname])
  const handleLogout = async () => {
    if (logOut) await logOut()
    router.push('/auth/signin')
  }
  const handleSearch = e => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    console.log('Recherche :', searchQuery)
    setSearchQuery('')
  }

  // Splits en deux lignes
  const row1 = NAV_ITEMS.slice(0, 5)
  const row2 = NAV_ITEMS.slice(5)

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`${styles.adminNavbar} ${scrolled ? styles.scrolled : ''}`}>
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} href="/admin/dashboard" className={styles.brand}>
          <i className="icofont-dashboard fs-4 text-primary me-2" />
          <span className="fw-bold">Admin</span>
          <span className="d-none d-sm-inline ms-1">Panel</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-nav" className="border-0">
          <i className="icofont-navigation-menu fs-4" />
        </Navbar.Toggle>

        <Navbar.Collapse id="admin-nav">
          {/* Deux lignes de nav */}
          <div className={styles.navRows}>
            <Nav className={styles.navRow}>
              {row1.map(item => (
                <Nav.Link
                  key={item.href}
                  as={Link}
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  <i className={`${item.icon} me-1`} />
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
            <Nav className={styles.navRow}>
              {row2.map(item => (
                <Nav.Link
                  key={item.href}
                  as={Link}
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  <i className={`${item.icon} me-1`} />
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </div>

          {/* Recherche inline */}
          <Form onSubmit={handleSearch} className={styles.inlineSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <i className="icofont-search-1 fs-5" />
              </Button>
            </InputGroup>
          </Form>

          {/* Notifications + Profil */}
          <div className={styles.actions}>
            <Dropdown align="end" className="me-2">
              <Dropdown.Toggle as={Button} className={styles.navActionBtn}>
                <i className="icofont-notification fs-5" />
              </Dropdown.Toggle>
            </Dropdown>
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} className={styles.userDropdown}>
                <Image
                  src={user?.photoURL || 'https://ui-avatars.com/api/?name=Admin'}
                  roundedCircle
                  width={32}
                  height={32}
                />
                <span className="ms-2 d-none d-lg-inline">
                  {user?.displayName || 'Admin'}
                </span>
              </Dropdown.Toggle>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

// ===== AdminNavbar.module.css =====

/* place ici le reste de tes styles (brand, navLink, scrolled, etc.) */
