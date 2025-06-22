import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function NavigationButton({ to, children, align = 'center' }) {
  const baseStyle = {
    display: 'inline-block',
    fontSize: '18px',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '9999px',
    color: '#ffffff',
    backgroundColor: '#2563eb', // blue
    textDecoration: 'none',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    alignSelf:
      align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
  }

  return (
    <Link
      to={to}
      style={baseStyle}
      onMouseOver={(e) => {
        e.target.style.backgroundImage = 'linear-gradient(to right, #10b981, #34d399)' // green gradient
        e.target.style.color = '#ffffff'
        e.target.style.transform = 'scale(1.05)'
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundImage = 'none'
        e.target.style.backgroundColor = '#2563eb'
        e.target.style.transform = 'scale(1)'
      }}
    >
      {children}
    </Link>
  )
}

NavigationButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
}