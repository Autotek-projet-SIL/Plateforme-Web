import Button from "../Composants/Button";
import NavBarATC from "../Composants/NavBarATC";
import NavBarD from "../Composants/NavBarD";
import { decryptData } from "../crypto";
import "./404.css";
// La page 404
function NotFound() {
  // Fonction qui genere les particules 4 ou 0
  function particles(num) {
    const n = 40;
    return [...Array(n)].map((e, i) => {
      return <span className={`particle p${num}`}>{num}</span>;
    });
  }

  if (localStorage.getItem("type") === null) {
    // Si l'utilisateur n'est pas connecté
    return (
      <div id="div404">
        <main className="container404">
          {particles(4)}
          {particles(0)}
          <article className="content404">
            <p>Page introuvable</p>
            <p>Il semblerait que cette page n'existe pas</p>
            <p>
              <Button
                title="Revenir vers la page d'accueil"
                btnClass="buttonPrincipal"
                onClick={() => (document.location.href = "/atc/")}
              />
            </p>
          </article>
        </main>
      </div>
    );
  } else if (decryptData(window.localStorage.getItem("type")) === "decideur") {
    // si l'utilisateur est un decideur
    return (
      <div id="div404">
        <NavBarD />
        <main className="container404">
          {particles(4)}
          {particles(0)}
          <article className="content404">
            <p>Page introuvable</p>
            <p>Il semblerait que cette page n'existe pas</p>
            <p>
              <Button
                title="Revenir vers la page d'accueil"
                btnClass="buttonPrincipal"
                onClick={() => (document.location.href = "/decideur/")}
              />
            </p>
          </article>
        </main>
      </div>
    );
  } else if (decryptData(window.localStorage.getItem("type")) === "atc") {
    // Si l'utilisateur est un ATC
    return (
      <div id="div404">
        <NavBarATC />
        <main className="container404">
          {particles(4)}
          {particles(0)}
          <article className="content404">
            <p>Page introuvable</p>
            <p>Il semblerait que cette page n'existe pas</p>
            <p>
              <Button
                title="Revenir vers la page d'accueil"
                btnClass="buttonPrincipal"
                onClick={() => (document.location.href = "/atc/")}
              />
            </p>
          </article>
        </main>
      </div>
    );
  }
}

export default NotFound;
