require 'json'

# read project configuration JSON
config = JSON.parse(File.read("config.json"))

# init provision constants
BASE_BOX = config["base_box"]                       # vagrant box to build
PROV_BASE = config["prov_base"]                     # provision .sh scripts location
PROV_SCRIPTS = config["prov_scripts"]               # order of provision scripts execution
ENV_MOD_FILE = config["env_mod_path"]               # path where environment modification .sh should be created
ENV_MOD_CMDS = config["env_mod_cmds"]               # commands to append to the env mod script
HOST_PORT = config["forward_ports"]["host"]         # port to forward to a host from a guest
GUEST_PORT = config["forward_ports"]["guest"]       # port to be forwarded from the guest
CPUS = config["vb_props"]["cpu_count"]              # amount of CPUs available for a VM
RAM = config["vb_props"]["ram_amount"]              # amount of RAM accessible by the VM
CPU_CAP = config["vb_props"]["cpu_cap_p"]           # maximum CPU load for a VM
VM_NAME = config["vb_props"]["vm_name"]             # virtualbox VM name to display

Vagrant.configure(2) do |config|

    # virtualbox specific configuration
    config.vm.provider "virtualbox" do |v|
        v.cpus = CPUS
        v.memory = RAM
        v.customize ["modifyvm", :id, "--cpuexecutioncap", CPU_CAP]
        v.name = VM_NAME
    end

    # base box to use
    config.vm.box = BASE_BOX

    # fixing annoying 'stdin: is not a tty' error
    # as seen at http://foo-o-rama.com/vagrant--stdin-is-not-a-tty--fix.html
    config.vm.provision "fix_no_tty", type: "shell" do |s|
        s.privileged = false
        s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
    end

    # running a set of provision scripts to prepare a vbox
    PROV_SCRIPTS.each do |pscript|
        config.vm.provision pscript[0..-4], type: "shell", path: PROV_BASE + pscript
    end

    # initializing string for writing environment modifications
    env_mod = "echo -n > #{ENV_MOD_FILE}"

    # appending all the modifications from configuration
    ENV_MOD_CMDS.each do |cmd|
        env_mod << "echo -e '#{cmd}\n' >> #{ENV_MOD_FILE}"
    end

    # writing environment modifications to the guest
    config.vm.provision "cust_env_setup", type: "shell", inline: env_mod

    # setting port forwarding to view the website in host's browser
    config.vm.network "forwarded_port", guest: GUEST_PORT, host: HOST_PORT
end