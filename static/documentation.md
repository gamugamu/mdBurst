[toc]

## Description:
_MDBurst est un site permettant de poster de la documentation markdown._

---
## Introduction:

MDBurst à pour but de faciliter les échanges, l'organisation et diffusions de documents sur des projets ou des thématiques.

Afin de faciliter l'accessibilité, MDBurst doit être simple d'**utilisation** et **accessible** dans son approche:
L'interface est minimaliste: le but est de poster et lire la documentation markdown **le plus rapidement possible** et en un **minimum de clics**.

L'interface permet de créer des **dossiers** et **sous-dossiers** afin d'organiser l'ensemble des documents. Il sera également possible d'émettre des commentaires sur les posts. Pour finir, une gestion de compte classique et simple afin de gérer les utilisateurs et leur posts. Poster **anonymement** est également envisageable.

---
##Structure:
![](/uploads/Capture_decran_2017-10-31_a_14.39.39.png)

Interface minimaliste; blablabla

+ Possibilité d'étendre l'usage à... vote des publications
+ commentaires
+ notifications

---
## HomePage

![](/uploads/home.png)

### #Ia01
* La page d'acceuil est accessible à l'url [root].

### #Ia02
* Tout les documents sont au format markdown et respectent le format [GFM][1].

### #Ia03
* La liste des dernières publications est directement accessible depuis la HomePage.
* Par default, seul les 20 dernières publications sont visibles.

### #Ia04
* L'action ***[showmore]*** permet de retrouver 20 autres publications.
* Cette action est possible tant qu'il reste des documents sur le serveur.

### #Ia05
* L'action ***[tags]*** permet de filtrer les publications en fonction de leurs tags.
* Ne remplace pas le tri mais se cumule à l'ordre chronologique.

### #Ia06
* L'action ***[post]*** permet de créer une nouvelle publication.
* Lors de cette action, l'utilisateur est redirigé vers la page ***Publication***.
* Une fois la publication faite, celle ci doit apparaître dans les dernières
publication de la Homepage.

### #Ia07
* L'action ***[login]*** permet de se logger à son compte.
* Le log se fait directement depuis la Homepage.
* Il doit être possible de créer un nouveau compte, ou de se logger à son compte déjà crée.

### #Ia08
* Un utilisateur ne peut pas faire de publication sans être loggé.

### #Ia09
* Lors de la sélection d'un post, celui ci se déplie pour afficher l'intégralité de son contenu.
* En resélectionnant l'entête du post, celui ci se replie pour reformer une liste.

![](/uploads/opened.png)
![](/uploads/closed.png)

---
## Publication
![](/uploads/post_2.png)

### #Ib01
* La page publication est accessible à l'url **[root/publication]**.

### #Ib02
* La publication est divisée en deux partie: la partie édition markdown, et la partie pré-visualisation qui permet de voir le rendu markdown au format html.

### #Ib03
* L'action ***[post]*** publie la publication en cours.

### #Ib04
* L'action ***[Titre]*** permet de donner un titre à la publication.

### #Ib05
* L'action ***[tag]*** permet de rajouter un tag à la publication.

### #Ib06
* La zone textarea permet de remplir le contenu de la publication.

[1]:https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown
