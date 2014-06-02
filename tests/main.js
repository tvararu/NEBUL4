// O suita de teste care descrie parte din functionarea paginii de landing.
describe('Landing page', function() {
  // Mai intai, se verifica daca textul din bara de adrese este cel corect.
  // Acesta este mai mult un "rain check", o verificare daca macar serverul
  // este pornit. Daca da eroare, inseamna ca ceva fundamental a dat greș.
  it('should have the correct title', function(done, server, client) {
    var titleText = client.evalSync(function() {
      // In interiorul blockului de evalSync, ne aflam in consola
      // JavaScript a clientului. Toate functiile rulate aici se vor comporta
      // ca din consola unui client real.
      // Putem simula astfel clickuri, apasari de taste, si sa vedem daca
      // structurile de date reflecta schimbarile.

      // Pentru inceput, vom pescui cu jQuery textul din titlul paginii.
      var titleText = $('title').text();

      // Pentru a evada din consola JavaScript, folosim o functie speciala
      // numita "emit" care este injectata de suita de teste, si ii pasam
      // o variabila.
      emit('return', titleText);
    });

    // Cu biblioteca de assert "should", verificam cu limbaj natural
    // daca titlul este ce ne asteptam sa fie.
    titleText.should.equal('NEBUL4');

    // Rulam callbackul de finalizare al testului.
    done();
  });

  describe('Login flow', function() {
    // Un alt text, in care verificam daca butonul de login este afisat.
    it('should show the login button', function(done, server, client) {
      var loginText = client.evalSync(function() {
        // Asteptam ca acesta sa se incarce in pagina.
        App.after('loginRendered', function() {
          // Pescuim textul.
          var loginText =
            $('#login-dropdown-list .dropdown-toggle').text().trim();

          emit('return', loginText);
        });
      });

      // Si verificam.
      loginText.should.equal('Sign In / Up');
      done();
    });

    it('login button should open the menu', function(done, server, client) {
      var dropdownOpen = client.evalSync(function() {
        App.after('loginRendered', function() {
          $('#login-dropdown-list .dropdown-toggle').click();

          var dropdownOpen = $('#login-dropdown-list').hasClass('open');

          emit('return', dropdownOpen);
        });
      });

      dropdownOpen.should.be.ok;
      done();
    });

    it('fields and buttons should be visible', function(done, server, client) {
      // Username field, password field, sign in button, sign up link
      // should all be visible.
      var elements = client.evalSync(function() {
        App.after('loginRendered', function() {
          $('#login-dropdown-list .dropdown-toggle').click();

          emit('return', {
            usernameField: $('#login-username').is(':visible'),
            passwordField: $('#login-password').is(':visible'),
            signinButton: $('#login-buttons-password').is(':visible'),
            signupLink: $('#signup-link').is(':visible')
          });
        });
      });

      elements.usernameField.should.be.ok;
      elements.passwordField.should.be.ok;
      elements.signinButton.should.be.ok;
      elements.signupLink.should.be.ok;

      done();
    });

    it('logging in should work', function(done, server, client) {
      // Username field, password field, sign in button, sign up link
      // should all be visible.
      var gameVisible = client.evalSync(function() {
        App.after('loginRendered', function() {
          $('#login-dropdown-list .dropdown-toggle').click();

          Meteor.setTimeout(function() {
            $('#signup-link').click();

            $('#login-username').val('test');
            $('#login-password').val('qwerty');
            $('#login-password-again').val('qwerty');

            $('#login-buttons-password').click();
          }, 1);
        });

        App.after('gameRendered', function() {
          emit('return', true);
        });
      });

      gameVisible.should.be.ok;

      done();
    });
  });
});

describe('Gameplay', function() {
  // it('up arrow should move ship forwards', function(done, server, client) {
  //   var position = client.evalSync(function() {
  //     var initial = 0, after = 0;
  // 
  //     if (App.container) {
  //       emit('return', { initial: initial, after: 0.1 });
  //     }
  // 
  //     App.container.on('keyboardInitialized', function(e, player) {
  //       emit('return', { initial: initial, after: 0.1 });
  //     });
  // 
  //     App.container.on('playerLoaded', function(e, player) {
  //       initial = player.position.z;
  // 
  //       emit('return', { initial: initial, after: after });
  //     });
  // 
  //     App.container.on('playerChanged', function(e, player) {
  //       after = player.position.z;
  // 
  //       emit('return', { initial: initial, after: after });
  //     });
  //   });
  // 
  //   console.log(position);
  //   position.initial.should.be.exactly(0);
  //   position.after.should.be.above(0);
  // 
  //   done();
  // });
  // 
  // it('konami code should work', function(done, server, client) {
  //   var codeDidTrigger = client.evalSync(function() {
  // 
  //     App.container.on('playerLoaded', function() {
  //       App.pushKeys('up up down down left right left right b a', 1);
  //     });
  // 
  //     App.container.on('konami', function() {
  //       emit('return', true);
  //     });
  //   });
  // 
  //   codeDidTrigger.should.equal(true);
  // 
  //   done();
  // });
});
