Proiect MDS
===

[![Build Status](https://travis-ci.org/tvararu/proiect-mds.png?branch=master)](https://travis-ci.org/tvararu/proiect-mds)

Acesta este proiectul la MDS al echipei formate din studenții:

* [Bogdan Boamfă](https://github.com/xbogdan)
* [Radu Constantin Cancel](https://github.com/raducc)
* [Alina-Diana Olaru](https://github.com/ciuff)
* [Theodor Văraru](https://github.com/tvararu)

Aplicatia este disponibila la adresa [http://mds.tvararu.ro](http://mds.tvararu.ro).

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
$ git clone https://github.com/tvararu/proiect-mds.git
$ cd proiect-mds
$ meteor
```

Atat! Ar trebui sa iti poti sa deschizi aplicatia pe `http://localhost:3000`. Meteor o sa refreshuiasca automat browserul atunci cand detecteaza schimbari de fisiere.

Consultati [Styleguide-ul](https://github.com/tvararu/proiect-mds/wiki/Styleguide), si apucati-va de codat.

Cum rulezi suita de teste
---

Mai intai trebuie sa instalezi dependintele pentru teste:

```bash
$ npm install -g laika phantomjs
```

De asemenea, trebuie sa instalezi `mongodb`, si sa il rulezi intr-un shell separat cu niste parametrii):

```bash
sudo mongod --smallfiles --noprealloc --nojournal
```

Dupa ce ai facut toate astea, rulezi comanda `laika`:

```bash
MBA13 ➜  proiect-mds git:(master) laika

  injecting laika...
  loading phantomjs...
  loading initial app pool...


  Landing page
    ✓ should have the correct title
    ✓ should display "Hello world!"


  2 passing (500ms)

  cleaning up injected code

MBA13 ➜  proiect-mds git:(master)
```

Mai multe detalii despre suita de teste pe [wiki](https://github.com/tvararu/proiect-mds/wiki/Suita-de-teste).

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
