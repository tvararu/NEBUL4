Proiect MDS
===

Acesta este proiectul la MDS al echipei formate din studenții:

* [Bogdan Boamfă](https://github.com/xbogdan)
* [Radu Constantin Cancel](https://github.com/raducc)
* [Alina-Diana Olaru](https://github.com/ciuff)
* [Theodor Văraru](https://github.com/tvararu)

How to contribute
---

Proiectul foloseste [Vagrant](http://www.vagrantup.com) pentru gestionarea development environmentului. Ca sa poti sa dezvolti, ai nevoie de urmatoarele softuri instalate:

* [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
* [Vagrant](http://www.vagrantup.com/downloads.html)
* [Virtualbox](https://www.virtualbox.org), sau orice alt provider de masini virtuale care e [compatibil cu Vagrant](http://docs.vagrantup.com/v2/providers/index.html)

Asta e tot. `vagrant` o sa creeze o masina virtuala cu tot restul dependintelor de orice natura:

1. Clonezi proiectul: `$ git clone git@github.com:tvararu/proiect-mds.git`
2. Navighezi in folderul lui: `$ cd proiect-mds`
3. Pornesti masina virtuala: `$ vagrant up`
4. Intri in masina virtuala: `$ vagrant ssh`
5. Pornesti din interiorul masinii virtuale serverul: `$ meteor`

Ar trebui apoi sa poti sa deschizi `localhost:3000` in browserul tau ca sa vezi proiectul.

Poti sa editezi codul in orice program; ai nevoie de masina virtuala doar ca sa rulezi serverul si suita de teste. Vezi rubrica de [Styleguide](https://github.com/tvararu/proiect-mds/wiki/Styleguide) din [wiki](https://github.com/tvararu/proiect-mds/wiki) pentru mai multe aspecte legate de cod.

Nu uita sa rulezi `$ vagrant suspend` atunci cand nu mai lucrezi pe proiect si ai inchis conexiunea ssh. Daca nu vrei sa babysituiesti masina virtuala in timp ce dezvolti, poti sa te uiti in fisierul `Vagrantfile` si sa incerci sa iti configurezi sistemul tau de operare dupa felul in care e provizionată masina din vagrant. Daca ai o distributie GNU/Linux, ar trebui sa fie straightforward; dar daca ai Windows de exemplu nici macar nu e posibil (Meteor nu ruleaza nativ pe Windows).

De facut
---
[Sintaxa Markdown](http://daringfireball.net/projects/markdown/syntax)

Tot aici sau in [wiki](https://github.com/tvararu/proiect-mds/wiki), trebuie sa mai facem (pe masura ce ne dam seama exact ce sunt):

* un document continand specificarea cerintelor, avand structura urmatoare:
   * descrierea in limbaj natural a intregului sistem
      (functionalitati, date, interfete);
   * descrierea structurii sistemului folosind reprezentari UML;
   * descrierea a doua componente functionale folosind un limbaj structurat
      si limbajul Z;
* un document continand proiectul software, cu descrierea functiilor si a
   datelor pentru limbajul/limbajele de programare alese;
* o documentatie de testare, referind tehnicile black box si white box;
