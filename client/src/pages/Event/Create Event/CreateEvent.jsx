import React from 'react'
import styles from './CreateEvent.module.css'

const CreateEvent = () => {
  return (
    <div className={styles.createEvent}>
        <h1>Create Event</h1>   
        <form> 
            <div className={styles.formGroup}>
                <label htmlFor="eventName">Event Name</label>
                <input type="text" id="eventName" name="eventName" />
            </div>
        </form>
    </div>
  )
}

export default CreateEvent