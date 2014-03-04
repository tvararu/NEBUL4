Proiect MDS
===

Acesta este proiectul la MDS al echipei formate din studenții:

* [Bogdan Boamfă](https://github.com/xbogdan)
* [Radu Constantin Cancel](https://github.com/raducc)
* [Alina-Diana Olaru](https://github.com/ciuff)
* [Theodor Văraru](https://github.com/tvararu)

Cum poti contribui
---

Ai nevoie de GNU/Linux sau OSX. Ca dependinte de sistem, ai nevoie de [Meteor](https://www.meteor.com) si de [Meteorite](https://github.com/oortcloud/meteorite#installing-meteorite):

```bash
$ curl https://install.meteor.com/ | sh # Meteor
$ npm install -g meteorite # Meteorite, care are nevoie de node: http://nodejs.org
```

Daca Meteorite plange ceva legat de drepturi, trebuie [sa il instalezi cu sudo -H](https://github.com/oortcloud/meteorite#installing-meteorite):

```bash
$ sudo -H npm install -g meteorite
```

Ca sa dezvolti:

1. Clonezi proiectul
2. Navighezi in folderul lui
3. Pornesti serverul

Cam asa:

```bash
$ git clone git@github.com:tvararu/proiect-mds.git
$ cd proiect-mds
$ meteor
```

Atat! Ar trebui sa iti poti sa deschizi aplicatia pe `http://localhost:3000`. Meteor o sa refreshuiasca automat browserul atunci cand detecteaza schimbari de fisiere.

Cum rulezi suita de teste
---

Mai intai trebuie sa instalezi dependintele pentru teste:

```bash
$ cd private/tests
$ npm install
```

Asigura-te ca serverul e pornit si merge la `http://localhost:3000`. Apoi, poti rula suita de teste cu comanda `npm test`:

```bash
MBA13 ➜  tests git:(master) npm test

> tests@0.0.0 test /Users/tvararu/Github/proiect-mds/private/tests
> node_modules/mocha-casperjs/bin/mocha-casperjs test.js



  Project
    ✓ should have correct title (223ms)
    ✓ should output hello world (42ms)


  2 passing (304ms)

MBA13 ➜  tests git:(master)
```

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
