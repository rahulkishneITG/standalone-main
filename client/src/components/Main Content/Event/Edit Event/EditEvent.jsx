import { useParams } from 'react-router-dom';
import styles from './EditEvent.module.css'

const EditEvent = () => {
  const { id } = useParams();

  return (
    <div className={styles.editEvent}>
      <h2>Editing Event with ID: {id}</h2>
    </div>
  );
};

export default EditEvent;
