# COURSE: CMPE 281
# TOPIC : Course Project - To implement a cloud-based shopping cart using MEAN stack.
          It should have a 3 node replication architecture and exhibit CAP properties in network partition mode.
          AWS to be used to deploy the distributed back-end.
          Heorku/Salesforce to be used to deply the Front-end code.
          
          
          
                                            _________
                                           | Slave 1 |
                                           /---------
                                          /
                                         /
         _______    HTTP      ________  /           ________
        | Heroku | --------> |  ELB   |------------| Master |
         -------             --------              --------
                                      \
                                       \
                                        \
                                         \_________
                                         | Slave 2 |
                                          ---------
