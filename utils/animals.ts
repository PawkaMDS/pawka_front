/**
 * Calcule l'âge d'un animal à partir de sa date de naissance
 * @param birthDate - Date de naissance au format ISO string ou Date
 * @returns L'âge en années (arrondi)
 */
export function getAnimalAge(birthDate: string | Date): number {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Si l'anniversaire n'a pas encore eu lieu cette année
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return Math.max(0, age); // Garantir que l'âge ne soit pas négatif
}

/**
 * Formate l'âge de l'animal de manière lisible
 * @param birthDate - Date de naissance au format ISO string ou Date
 * @returns Chaîne formatée ex: "2 ans" ou "4 mois"
 */
export function formatAnimalAge(birthDate: string | Date): string {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    // Ajuster si le mois est négatif
    if (months < 0) {
        years--;
        months += 12;
    }

    // Ajuster si le jour n'est pas encore atteint
    if (today.getDate() < birth.getDate() && months > 0) {
        months--;
    } else if (today.getDate() < birth.getDate() && months === 0 && years > 0) {
        years--;
        months = 11;
    }

    // Retourner le format approprié
    if (years > 0) {
        return years === 1 ? `${years} an` : `${years} ans`;
    } else if (months > 0) {
        return months === 1 ? `${months} mois` : `${months} mois`;
    } else {
        return 'Moins d\'un mois';
    }
}
