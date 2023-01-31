#!/bin/bash

info="44;37m"
success="42;30m"
error="41;37m"
default="47;34m"

fn="$(date +%Y%m%d%H%M%S)_$(openssl rand -hex 4)"

trap 'onCtrlC' INT
function onCtrlC () {
    if [ -f dist ]; then rm -rf dist; fi
    if [ -f $fn.tar.gz ]; then rm $fn.tar.gz; fi
    echo -e "\033[$default Cancelled. \033[0m" 
    exit
}

yarn build

if [ $? -eq 0 ]; then

    echo ""
    for ((i=3; i>=0; i--))
    do
        if [ "$i" = "0" ]; then

            if [ $? -eq 0 ]; then

                echo $(tar -czf $fn.tar.gz dist)
                echo $(rm -rf dist)
                echo ""

                if [ $? -eq 0 ]; then

                    echo -e "\033[$info Which hostname do you want to deploy to ? \033[0m" 
                    select selection in "www.imusm.cn" "192.168.1.3:6610" "Input"
                    do
                        case $selection in 
                            "www.imusm.cn")
                                deploy_url="https://www.imusm.cn/cor/sys/deploy"
                                break
                                ;;
                            "192.168.1.3:6610")
                                deploy_url="https://192.168.1.3:6610/cor/sys/deploy"
                                break
                                ;;
                            "Input")
                                read -p "Enter Your Hostname: " hostname
                                deploy_url="${hostname}/cor/sys/deploy"
                                break
                                ;;
                            *)
                                echo -e "\033[$error Wrong selection! Please reselect...\033[0m" 
                        esac
                    done

                    echo -e "\033[$info The project will deploy to [$deploy_url] \033[0m"
                    echo $(curl -F "file=@$fn.tar.gz" -F "type=client" "$deploy_url" )
                    sleep 1

                    echo $(rm $fn.tar.gz)
                    exit

                else
                    exit
                fi

            else
                exit
            fi

            exit
        fi
        ((Second=$i%60))
        echo -ne "\033[$success The project will be compressed to $fn.tar.gz in $Second seconds. \033[0m\r"
        sleep 1
    done

else
    exit
fi
