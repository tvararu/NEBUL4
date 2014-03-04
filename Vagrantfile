VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # We use a basic Ubuntu 12.04 32bit box.
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"
  
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  
  # Provision our virtual machine with a fully functioning Meteor dev environment.
  config.vm.provision "shell" do |s|
    cmds = []
    
    # Run apt-get update like a good boy scout, then install curl.
    cmds.push 'sudo apt-get update'
    cmds.push 'sudo apt-get install -y curl'
    
    # Install Meteor.
    cmds.push 'curl https://install.meteor.com/ | sh'

    # ACHTUNG: You probably don't need to run any of the commands below if you're not
    # using Vagrant and you're configuring your own machine.
    
    # Symlink the mongo database inside vagrant, otherwise Meteor complains:
    # http://grahamrhay.wordpress.com/2013/06/18/running-meteor-in-a-vagrant-virtualbox/
    cmds.push 'mkdir ~/db'
    cmds.push 'ln -s ~/db /vagrant/.meteor/local/db'
    
    # Tell bash to always navigate you to the /vagrant/ directory when you start.
    # Parantheses because operator order, double escaping because bash -c "".
    cmds.push '( printf \"\ncd /vagrant/\" >> ~/.bashrc )'
    
    # Join all commands with ' && ' between them, and run them as the `vagrant` user.
    s.inline = "sudo -H -u vagrant bash -c \"#{cmds.join(' && ')}\""
  end
end
