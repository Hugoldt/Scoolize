
export function standardNormalCDF(z) {
    const absZ = Math.abs(z);
    const t = 1 / (1 + 0.2316419 * absZ);
    const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * absZ * absZ);
    const cdf = 1 - pdf * poly;
    return z < 0 ? 1 - cdf : cdf;
}

export function calculerProbabiliteAdmission(etudiantNoteMoyenne, moyenneAdmis, ecartTypeAdmis, poidsPriorite) {
    const sigma = ecartTypeAdmis > 0 ? ecartTypeAdmis : 1e-6;
    const zScore = (etudiantNoteMoyenne - moyenneAdmis) / sigma;
    const probabiliteBase = standardNormalCDF(zScore);

    const probabiliteFinale = probabiliteBase * poidsPriorite + (1 - probabiliteBase) * (1 - poidsPriorite);
    const pourcentage = Math.round(probabiliteFinale * 100);

    let interpretation = "Peu Probable";
    if (pourcentage > 80) {
        interpretation = "Très Favorable";
    } else if (pourcentage >= 60) {
        interpretation = "Favorable";
    } else if (pourcentage >= 40) {
        interpretation = "À Surveiller";
    }

    return { pourcentage, interpretation, zScore, probabiliteBase, probabiliteFinale };
}

export default calculerProbabiliteAdmission;

