// src/feedback/confirm.js
// Diálogo de confirmación multiplataforma. En web, Alert.alert ignora los botones,
// así que usamos window.confirm.
import { Alert, Platform } from 'react-native';

/**
 * const ok = await confirm({ title, message, confirmText: 'Eliminar', destructive: true });
 * @returns {Promise<boolean>}
 */
export function confirm({ title, message, confirmText = 'Aceptar', cancelText = 'Cancelar', destructive = false }) {
    if (Platform.OS === 'web') {
        return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
    }
    return new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
                { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
            ],
            { cancelable: true, onDismiss: () => resolve(false) }
        );
    });
}
