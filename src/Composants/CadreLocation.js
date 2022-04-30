import './stylesheets/CadreLocation.css';
function CadreLocation (props)
{
    return(
    <div className='cadreLocation'>
        <p title="Id de la location">id</p>
        <p title="Adresse départ de la location">De:Adresse départ</p>
        <p title="Adresse d'arrivée de la location">Vers:Adresse d'arrivée</p>
        <p title="Durée de la location">Durée</p>
        <p title="Etat de la location">Etat</p>
        <a title="Visionner Plus d'informations sur la location" href="/atc/gestionlocations/id!!!">Plus d'informations</a>
    </div>)
}
export default CadreLocation;