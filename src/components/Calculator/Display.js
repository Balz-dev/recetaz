/**
 * Tutorial: Separación de Componentes
 * -----------------------------------
 * Separamos la Pantalla (Display) en su propio componente para mantener nuestro código modular.
 * Este componente es "tonto" o "presentacional": solo recibe datos (props)
 * y los renderiza. No sabe *cómo* ocurre el cálculo.
 */
import styles from './Calculator.module.css'; // Crearemos este archivo CSS a continuación

export default function Display({ value, previousValue, operator }) {
    return (
        <div className={styles.displayContainer}>
            {/* Mostrar el historial (ej. "12 +") */}
            <div className={styles.history}>
                {previousValue} {operator}
            </div>

            {/* Mostrar la entrada actual */}
            <div className={styles.currentValue}>
                {value}
            </div>
        </div>
    );
}
