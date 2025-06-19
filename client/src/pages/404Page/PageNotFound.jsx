import React from 'react'
import { Link } from 'react-router-dom'
import styles from './PageNotFound.module.css'
export const PageNotFound = () => {
  return (
    <div className={styles.pageNotFound}>
        <h1 className={styles.title}>404 Page Not Found</h1>
        <p className={styles.description}>The page you are looking for does not exist.</p>
        <Link to="/" className={styles.link}>Go to Home</Link>
    </div>
  )
}
