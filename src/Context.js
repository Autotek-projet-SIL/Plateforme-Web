import {useState, createContext} from "react";
// contexte qui sauvegarde l'utilisateur : variable globale
export const UserContext = createContext({
    autUser: 'null'});

export const UserProvider = ({ children }) => {
        const [user, setUser] = useState({ });
          
        const login = (autUser, typeUser) => {
          // logging + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
            window.localStorage.setItem('auth', "true"); // authentifié
            window.localStorage.setItem('type' ,typeUser); // type de l'utilisateur atc/décideur
            window.localStorage.setItem('autUserId', autUser.id); // ID de l'utilisateur
            setUser((user) => ({
                autUser: autUser
            }));
        };
        const logout = () => {
          // logout + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
          window.localStorage.setItem('auth', "false"); //Non authentifié
          window.localStorage.removeItem('type');
          window.localStorage.removeItem('autUserId');
          setUser((user) => ({
              autUser: ''
          }));
        };
        const loggingOut = () => {
          // lougout + reloading page
          logout();
          window.location.reload();
        };
        
        //Retourner le contexte 
        return (
          <UserContext.Provider value={{ user, login, logout, loggingOut }}>
            {children}
          </UserContext.Provider>
        );
      }