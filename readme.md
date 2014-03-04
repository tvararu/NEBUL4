Proiect MDS
===

Acesta este proiectul la MDS al echipei formate din studenții:

* [Bogdan Boamfă](https://github.com/xbogdan)
* [Radu Constantin Cancel](https://github.com/raducc)
* [Alina-Diana Olaru](https://github.com/ciuff)
* [Theodor Văraru](https://github.com/tvararu)

Cum poti contribui
---

Ai nevoie de GNU/Linux sau OSX. Ca dependinte de sistem, ai nevoie de Meteor si Meteorite:

```bash
$ curl https://install.meteor.com/ | sh # Meteor
$ npm install -g meteorite # Meteorite, care are nevoie de node: http://nodejs.org
```

Ca sa dezvolti: clonezi proiectul, navighezi in folderul lui si pornesti serverul:

```bash
$ git clone git@github.com:tvararu/proiect-mds.git
$ cd proiect-mds
$ meteor
```

Atat! Ar trebui sa iti poti sa deschizi aplicatia pe `http://localhost:3000`. Meteor ar trebui sa iti refreshuiasca automat browserul atunci cand detecteaza schimbari de fisiere. Uneori s-ar putea sa trebuiasca sa repornesti serverul.

Cum rulezi suita de teste
---

Placeholder.

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
