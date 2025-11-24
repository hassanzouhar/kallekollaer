
import { Team, Position, Player, Scout, TrainingFocus, DirtyDeal, LineAssignment, StaffRole, TacticStyle, AggressionLevel, PlayerPersonality, ScheduledMatch } from './types';

// ... (Previous Player Generation and CSV constants remain unchanged, keep them here) ...
// RE-INSERT RAW CSV DATA VARIABLES HERE (RAW_TEAMS_CSV, RAW_GOALIES_CSV, RAW_PLAYERS_CSV) to ensure file integrity. 

const RAW_TEAMS_CSV = `TEAM,GP,PPGF,ADV,PP%,SHGA,PPGA,TSH,PK%,SHGF,FO%
Frisk Asker/NTG,13,15,47,31.9,2,12,44,72.7,3,55.6
Jar/Jutul,13,4,44,9.1,4,10,53,81.1,0,39.1
Kongsvinger,13,3,40,7.5,1,11,39,71.8,2,45.8
Lillehammer Elite/NTG,13,10,51,19.6,5,12,51,76.5,0,47.9
Lørenskog/Furuset,13,9,49,18.4,0,6,44,86.4,1,48.6
Manglerud Star,11,3,29,10.3,3,10,37,73,0,47.1
Nidaros,10,4,29,13.8,0,9,40,77.5,1,44.8
Sparta Sarp,11,7,33,21.2,2,13,41,68.3,3,51.5
Stavanger,14,10,49,20.4,2,9,55,83.6,2,54.7
Stjernen,13,18,60,30,1,6,29,79.3,0,58
Storhamar YA/Stange,11,18,45,40,1,6,37,83.8,3,54.1
Vålerenga,11,9,34,26.5,1,6,40,85,7,53.2`;

const RAW_GOALIES_CSV = `RK,Name,TEAM,GP,TOI,W,L,SO,GA,GAA,SV,SV%
1,"Kviteng, Ola August",NID,4,118,2,0,0,3,1.53,47,94
2,"Desmot, Henrik",VÅL,6,120,2,0,0,1,0.5,15,93.8
3,"Berry, Lucas Nysted",LØR,4,180,2,1,0,7,2.33,87,92.6
4,"West, Kristian Stenrød",JAR,2,52,0,1,0,2,2.31,24,92.3
5,"Grotnes, Kalle Falch",STJ,7,300,5,0,0,7,1.4,80,92
5,"Strømberg, Daniel",STA,13,411,5,2,0,16,2.34,183,92
7,"Jacobsen, Oliver Skartveit",STA,9,262,3,1,0,9,2.06,84,90.3
8,"Smestad, Viktor Langbråten",STO,7,300,5,0,0,9,1.8,81,90
9,"Kvarme, Samuel Selvikvåg",MAN,5,226,0,4,0,15,4,127,89.4
10,"Hushagen, Herman",LIL,9,180,2,1,0,12,4,93,88.6
11,"Nordli, Edvard",KON,11,400,4,3,0,23,3.45,175,88.4
12,"Otterlei, Anders",LØR,3,185,1,1,1,13,4.22,97,88.2
13,"Rønningen, Vebjørn Elvebakk",LIL,9,334,1,4,0,20,3.59,142,87.7
14,"Taftø, Aksel Bjørgum",NID,8,239,0,4,0,22,5.52,156,87.6
14,"Leira, Aleksander",LØR,8,362,2,4,0,23,3.82,162,87.6
16,"Bay, Max Aadne",VÅL,11,481,6,2,0,26,3.25,182,87.5
17,"Foldøy, Benjamin Johan",FRI,13,359,4,2,0,18,3.01,123,87.2
18,"Mørland, Petter",JAR,11,398,1,6,0,32,4.85,217,87.1
19,"Jerven, Ole Blytt",FRI,13,423,6,1,0,21,2.98,141,87
20,"Bryni, Aleksander Tørmo",STJ,5,60,1,0,0,4,4,26,86.7
21,"Flåm, Theodor",STJ,13,417,3,4,0,26,3.75,168,86.6
22,"Nereng-Olsen, Leon Andrés",STO,2,59,0,1,0,3,3.05,19,86.4
23,"Baltic, Eldar",SPA,9,306,3,3,0,25,4.92,158,86.3
23,"Spanne, Jakob Cabarrubias",LIL,8,254,0,5,0,20,4.72,126,86.3
25,"Hoem, Emil",NID,8,238,0,4,0,26,6.58,160,86
26,"Bukten, Henrik Nordnes",STO,9,304,5,0,0,12,2.37,73,85.9
27,"Sonefors, Samuel Lars Elon",SPA,4,80,0,1,0,7,5.25,42,85.7
28,"Baklund, Martin Falch",VÅL,5,60,0,1,0,3,3,17,85
29,"Dal Pan, Leo Thomas",MAN,8,334,2,3,1,34,6.13,188,84.7
30,"Oustad, Mikkel Foronda",KON,13,377,2,4,0,27,4.31,146,84.4
31,"Skrøder, Marius Rotefoss",SPA,9,273,2,2,0,27,5.93,130,82.8
32,"Høvik, Leon",LØR,11,60,1,0,0,4,4,17,81
33,"Nordberg, Pascal Uribe",MAN,9,100,1,1,0,6,3.6,25,80.6
34,"Angeltvedt, Håkon",JAR,11,319,0,5,0,51,9.62,165,76.4
35,"Bjørnsgaard, Petter",STA,5,163,1,1,0,13,4.79,33,71.7
36,"Rafiqi, Sofian Daniel",JAR,1,7,0,0,0,5,42.86,2,28.6
37,"Kristiansen, Mikkel",KON,2,0,0,0,0,0,0,0,0
37,"Ek, Sander Jenvild",STJ,1,0,0,0,0,0,0,0,0
37,"Solberg, Oskar Daniel",JAR,1,0,0,0,0,0,0,0,0
37,"Egeland, Emil",STA,1,0,0,0,0,0,0,0,0
37,"Bjerke-Narud, Herman Alme",STO,4,0,0,0,0,0,0,0,0`;

const RAW_PLAYERS_CSV = `RK,Name,Team,GP,G,A,PTS,"""+-""",PIM,PP,PPA,SH,SHA,GWG,SOG,S%,FO,FO%
1,"Nilsgård, Oskar Kaatorp",STO,11,10,15,25,16,10,2,3,1,0,4,38,26.3,1,0
2,"Vestberg, Tobias",SPA,10,10,14,24,7,6,1,3,0,0,2,32,31.3,10,60
3,"Rannstad, Patrick Bekkevold",STO,10,11,11,22,15,0,4,3,0,1,0,30,36.7,0,0
4,"Mattsson, Elias",SPA,10,5,15,20,9,4,1,2,0,0,0,27,18.5,2,100
5,"Lien, Olai Høyem",STJ,6,6,12,18,17,2,1,5,0,0,1,36,16.7,0,0
6,"Ruud, Aleksander Torgrimsen",STO,11,6,11,17,10,4,0,6,0,0,1,21,28.6,166,56
6,"Andersen, Aksel Stenmoe",STJ,10,7,10,17,6,14,3,4,0,0,1,54,13,0,0
8,"Bjørnstad, Linus",FRI,12,6,10,16,8,6,1,2,1,0,0,22,27.3,2,50
8,"Vold, Anders Fuhr",STO,11,9,7,16,15,2,3,2,0,1,1,43,20.9,33,57.6
8,"Karlsson, Conrad",MAN,10,8,8,16,3,6,1,1,0,0,2,76,10.5,155,46.5
8,"Lie, Casper Nicolai",STO,11,4,12,16,11,0,0,4,1,0,0,19,21.1,2,50
12,"Sætre, Ola Noer",KON,13,9,6,15,7,10,1,2,1,0,3,34,26.5,10,60
12,"Johansen, Jonas",SPA,10,1,14,15,5,6,0,1,0,1,0,23,4.3,0,0
12,"Skumlien, Oliver Løgith",KON,11,5,10,15,6,0,1,1,0,1,0,24,20.8,155,43.9
12,"Andersen, Elias Gøsta",STJ,12,7,8,15,0,6,5,3,0,0,0,34,20.6,14,57.1
12,"Fadnes, Kristian Trinborg",FRI,7,4,11,15,10,0,0,6,1,0,0,15,26.7,3,33.3
12,"Noer, Alexander Noa Lundell",FRI,13,7,8,15,10,4,1,1,0,1,2,25,28,50,64
12,"Oommen, Timothy Simon",STJ,13,6,9,15,10,6,0,0,0,0,1,31,19.4,1,0
12,"Melleby, Tobias Johansen",STO,11,5,10,15,15,2,1,3,1,1,0,35,14.3,165,51.5
20,"Kuvås, Aron Husevik",VÅL,6,3,11,14,11,0,0,0,0,1,1,22,13.6,3,0
20,"Messa, Sid James David",LØR,12,4,10,14,4,0,0,5,0,0,1,27,14.8,186,40.9
20,"Vassøy, Mathias",STA,11,6,8,14,9,0,0,1,0,0,0,30,20,157,58
20,"Nilsgård, Luka Kaatorp",STO,11,7,7,14,21,6,2,1,0,1,0,42,16.7,1,0
24,"Lager, Phillip Gjessing",SPA,10,11,2,13,7,4,2,0,1,0,2,26,42.3,232,56.9
24,"Priede, Martins",STA,12,8,5,13,-1,41,2,2,0,1,2,51,15.7,43,74.4
26,"Bastiansen, Elias Peter",FRI,13,6,6,12,6,8,1,2,1,0,1,25,24,138,45.7
26,"Wallace, Martin",LØR,12,3,9,12,7,8,0,1,0,0,1,25,12,6,83.3
26,"Bratland, Aksel",LØR,12,4,8,12,-3,0,3,4,0,0,0,33,12.1,243,49
26,"Cederquist, Iver Riise",VÅL,11,2,10,12,6,0,0,3,1,1,0,31,6.5,3,66.7
26,"Hansen, Lucas",STO,9,3,9,12,12,27,2,2,0,0,0,20,15,0,0
26,"Flinskau, Daniel",MAN,8,7,5,12,7,33,0,0,0,0,1,32,21.9,8,50
26,"Næss, Jonas",STA,11,2,10,12,16,6,0,1,0,0,0,25,8,5,40
26,"Strømsborg, Thomas Lindblad",STJ,11,5,7,12,6,27,1,1,0,0,0,33,15.2,123,57.7
34,"Hundsnes, Håvard",STA,14,3,8,11,10,13,1,0,0,0,1,36,8.3,2,100
34,"Flade, Håkon Johannes",STO,6,2,9,11,8,8,1,2,0,0,0,11,18.2,82,59.8
34,"Engh, Fredrik",VÅL,10,5,6,11,0,6,2,0,0,0,0,28,17.9,149,54.4
34,"Hyttebakk, Jonas Golberg",FRI,10,4,7,11,9,4,2,2,0,0,0,22,18.2,0,0
34,"Narvestad, Matias Sveen",FRI,11,6,5,11,10,6,1,1,0,0,1,19,31.6,2,50
34,"Giske, Lucas",LØR,13,6,5,11,-8,12,1,0,0,0,0,32,18.8,0,0
34,"Løken, Vegard",FRI,13,4,7,11,14,2,1,2,0,0,1,35,11.4,1,0
34,"Kleven, Alexander Hoel",STO,11,3,8,11,10,8,1,0,0,0,0,19,15.8,1,0
34,"Kreutz, Eirik Skaarer",STJ,13,5,6,11,3,0,0,0,0,0,1,26,19.2,75,48
34,"Lindahl, Sander Froberg",STJ,12,6,5,11,2,4,2,4,0,0,1,26,23.1,2,0
34,"Naboichenko, Tymofii",STA,11,4,7,11,11,0,0,1,0,0,2,26,15.4,20,85
45,"Justnes, August Hovind",FRI,13,6,4,10,6,6,2,1,0,0,1,33,18.2,5,60
45,"Nordrum, Philip Mikael",FRI,8,2,8,10,15,6,0,1,0,0,0,19,10.5,1,0
45,"Puntervold, Mats André Walaunet",LØR,13,6,4,10,-5,12,3,1,0,0,0,42,14.3,1,100
45,"Fadnes, Jonas Trinborg",FRI,12,2,8,10,9,0,1,1,0,0,1,15,13.3,1,0
45,"Kovalenko, Edvin",STA,12,5,5,10,11,10,1,0,0,0,1,37,13.5,0,0
45,"Kolflaath, Filip Mauritzon",VÅL,5,7,3,10,11,0,0,0,3,0,0,10,70,62,56.5
45,"Hendrichs, William Wike",FRI,13,6,4,10,7,2,1,0,0,0,1,30,20,144,51.4
45,"Ulving-Tufte, Martinus",FRI,9,1,9,10,9,6,1,1,0,0,0,19,5.3,0,0
45,"Dubec, Matheo Werner",STJ,4,6,4,10,5,0,2,3,0,0,0,24,25,3,100
45,"Norum, Johannes",VÅL,5,4,6,10,5,8,3,3,0,0,1,28,14.3,75,58.7
55,"Nordstrøm, Mikkel Lund",STO,9,1,8,9,14,0,0,2,0,1,0,13,7.7,0,0
55,"Grunnreis, Ola",LØR,7,1,8,9,-3,8,1,3,0,0,0,19,5.3,0,0
55,"Josefsen, Mathias Wister",SPA,10,1,8,9,4,6,0,3,1,1,0,13,7.7,2,50
55,"Moflag, Sivert Østnor",VÅL,5,5,4,9,2,2,1,1,1,0,1,15,33.3,62,56.5
55,"Bjølsand, Dennis Sørlie",MAN,10,4,5,9,-1,0,1,0,0,0,0,21,19,2,0
55,"Temerov, Ilya Romanovich",STA,9,7,2,9,5,6,2,0,1,0,1,52,13.5,8,12.5
55,"Hulleberg, Tobias Westby",SPA,11,3,6,9,-13,12,0,2,0,0,0,22,13.6,73,49.3
55,"Storrød-Myrén, Mathias Theodor",VÅL,11,5,4,9,8,29,0,0,0,0,0,25,20,5,40
55,"Ånerud, Fredrik Sletholen",KON,10,3,6,9,1,2,0,1,0,0,0,18,16.7,173,56.1
64,"Hura, Tymofii",STA,14,3,5,8,-1,8,0,1,1,0,1,19,15.8,12,41.7
64,"Owen, Isaac Thomas",STJ,6,2,6,8,-2,2,1,4,0,0,1,19,10.5,127,63
64,"Årbogen, Oskar Kjærvik",KON,12,5,3,8,5,2,0,0,1,0,2,20,25,12,41.7
64,"Storsveen, Herman",STO,9,4,4,8,9,0,0,0,0,0,1,8,50,66,51.5
64,"Nordenson, Nicolai Hodne",VÅL,10,4,4,8,7,2,0,0,0,0,1,28,14.3,1,0
64,"Ilstad, Sivert",STO,9,2,6,8,15,8,0,1,0,0,0,10,20,0,0
64,"Proskurnicki, Michael Elton",FRI,13,1,7,8,1,4,1,1,0,1,1,30,3.3,69,58
64,"Ydsti, Noah Per Eklund",NID,8,1,7,8,-5,2,0,3,0,0,0,38,2.6,11,45.5
64,"Andersen, Julian Knold",STJ,4,3,5,8,7,0,2,0,0,0,0,13,23.1,49,65.3
64,"Braaten, Lucas",VÅL,11,6,2,8,7,4,1,1,2,0,1,14,42.9,3,66.7
64,"Orre, Vincent",FRI,13,3,5,8,11,27,1,1,0,1,0,21,14.3,2,50
64,"Hermansen, Anton Ekeland",STJ,11,1,7,8,0,2,0,3,0,0,0,12,8.3,137,58.4
64,"Lingsom, Magnus Flottorp",VÅL,11,0,8,8,15,0,0,0,0,0,0,12,0,0,0
64,"Pukownik, Kristian David",LØR,7,4,4,8,1,4,0,0,0,0,0,18,22.2,0,0
78,"Dittmann, Eirik Midtdal",MAN,9,1,6,7,-1,0,0,0,0,0,0,6,16.7,11,36.4
78,"Antonsen, Markus",KON,13,3,4,7,3,2,0,0,0,0,0,23,13,7,28.6
78,"Bunæs, Trym",STJ,7,1,6,7,6,4,0,1,0,0,0,27,3.7,0,0
78,"Bakkerud, Balder Jonsson",STJ,9,5,2,7,4,0,0,0,0,0,1,18,27.8,4,0
78,"Sollund, Nikolai Sørlie",LØR,6,5,2,7,2,8,1,1,0,0,0,22,22.7,1,0
78,"Myhre, Adrian",VÅL,11,6,1,7,1,4,2,0,0,0,1,26,23.1,10,40
78,"Røsås, Jonathan",LIL,7,5,2,7,-6,6,2,1,0,0,0,19,26.3,2,100
78,"L Heureux, William Kunz",FRI,13,3,4,7,4,6,0,1,0,0,0,30,10,78,42.3
86,"Larsen, Adrian Leander",LØR,12,3,3,6,1,27,0,1,1,0,0,33,9.1,1,100
86,"Slette, Jonah",LIL,9,3,3,6,-3,0,1,2,0,0,0,23,13,185,56.8
86,"Lyngdal, Lars Julian Soza",FRI,12,3,3,6,3,2,0,0,0,0,0,23,13,4,50
86,"Stautland, Simon",MAN,8,4,2,6,4,0,0,0,0,0,0,14,28.6,2,50
86,"Rindal, Benjamin Stakston",LIL,9,2,4,6,-8,2,1,4,0,0,0,18,11.1,7,28.6
86,"Helminsen, Johannes Ruud",STJ,13,0,6,6,-1,8,0,1,0,0,0,21,0,2,0
86,"Roen, Petter Foyn",MAN,5,1,5,6,1,0,0,1,0,0,0,10,10,67,58.2
86,"Aanestad, Ola Stangeland",STA,14,1,5,6,5,4,0,1,0,0,0,18,5.6,176,58
86,"Ribbing, Fredrik Randtun",STO,9,2,4,6,5,10,0,0,0,0,1,19,10.5,6,83.3
86,"Lystad, Ola Gorset",MAN,11,1,5,6,4,10,0,0,0,0,0,12,8.3,1,0
86,"Peck, Max Georg Noer",JAR,9,1,5,6,-9,2,0,2,0,0,0,18,5.6,0,0
86,"Ekberg, Marinius Sixten Arne",FRI,8,2,4,6,10,2,0,0,0,0,0,9,22.2,22,72.7
86,"Støen, Adrian Aleksander",VÅL,9,0,6,6,7,12,0,3,0,0,0,12,0,0,0
86,"Holmsen, Simen",KON,12,0,6,6,11,2,0,2,0,0,0,20,0,1,0
86,"Otterlei, Patrick Alexander Coloma",VÅL,11,1,5,6,7,10,0,3,0,0,1,8,12.5,0,0
86,"Kolstad, Herman Hjellestad",FRI,13,3,3,6,3,4,0,1,0,0,1,28,10.7,0,0
86,"Martin-Blikset, Sebastian",VÅL,6,1,5,6,11,4,0,1,0,0,0,14,7.1,0,0
86,"Olstad, Calvin Emilio",LØR,13,5,1,6,1,2,0,0,0,0,3,12,41.7,0,0
86,"Thun, Trym Tveiten",KON,10,2,4,6,1,8,0,0,0,0,0,13,15.4,33,42.4
86,"Engebakken, Isak",STO,9,2,4,6,5,4,0,1,0,0,0,11,18.2,53,52.8
86,"Lukac, Maxim",FRI,12,3,3,6,5,27,0,1,0,0,0,25,12,108,66.7
86,"Riise, Theodor Noah",LIL,13,1,5,6,-4,2,1,1,0,0,0,14,7.1,115,56.5
86,"Burum, Tex",STJ,9,2,4,6,9,0,1,2,0,0,0,16,12.5,1,0
86,"Lerbakk, Kristoffer",STJ,12,2,4,6,-5,4,0,1,0,0,1,15,13.3,5,100
86,"Samuelsen, Kurt Magnus",STA,14,3,3,6,-6,4,2,1,0,0,0,29,10.3,2,50
86,"Kristiansen, Emil Johansson",LØR,12,1,5,6,4,0,0,0,0,0,0,14,7.1,0,0
112,"Johansson, Sander",SPA,11,3,2,5,-14,6,1,0,1,0,0,14,21.4,42,47.6
112,"Møller, Henrik Andreas Horjen",STA,14,1,4,5,2,6,0,1,0,0,0,14,7.1,0,0
112,"Mallaug, Enrico",LIL,12,4,1,5,-4,6,0,0,0,0,1,28,14.3,9,55.6
112,"Bringager, Sondre",MAN,11,2,3,5,-2,2,0,0,0,0,0,27,7.4,12,41.7
112,"Vargas, Luca",VÅL,10,0,5,5,5,35,0,0,0,0,0,13,0,110,59.1
112,"Haug, Oscar Sebastian Auli",JAR,13,2,3,5,-20,2,2,0,0,0,0,14,14.3,4,0
112,"Bergehagen, Theo Aamodt",LIL,13,4,1,5,-2,8,2,0,0,0,1,20,20,0,0
112,"Slette, Eliah",LIL,4,2,3,5,0,8,1,1,0,0,1,10,20,7,42.9
112,"Dal Pan, Tom David",MAN,7,1,4,5,5,12,0,0,0,0,0,17,5.9,63,41.3
112,"Haugen, Julian",SPA,11,3,2,5,-1,6,0,0,0,1,0,13,23.1,132,49.2
112,"Morken, Linus",KON,11,2,3,5,2,4,0,0,0,0,0,16,12.5,99,45.5
112,"Dzenis, Gusts",LØR,12,2,3,5,4,2,0,0,0,0,0,13,15.4,2,100
112,"Castberg, Theodor Lyngvær",STO,8,1,4,5,5,0,0,0,0,0,1,8,12.5,1,0
112,"Kononenko, Yaroslav",STA,6,2,3,5,2,10,0,1,0,0,1,15,13.3,94,47.9
126,"Zouhar, Leo Samuel Moe",LIL,12,3,1,4,-4,10,0,1,0,0,0,14,21.4,3,33.3
126,"Bratlien, Ulrik Foss",LIL,13,2,2,4,2,8,0,0,0,0,0,11,18.2,0,0
126,"Liland, Sverre Lillevoll",FRI,4,1,3,4,-2,4,1,2,0,0,0,14,7.1,56,73.2
126,"Ruud, Heine Johan Solberg",KON,7,3,1,4,-1,4,0,0,0,0,0,5,60,38,31.6
126,"Cederquist, Johan Riise",VÅL,11,2,2,4,7,4,0,0,0,1,0,11,18.2,0,0
126,"Skirbekk, Tobias Joachim",KON,10,3,1,4,-1,2,0,0,0,0,1,36,8.3,5,40
126,"Paulsen, Henrik Hekk",MAN,10,2,2,4,0,2,0,0,0,0,0,9,22.2,149,45.6
126,"Nastad, Eirik Eriksen",KON,11,3,1,4,1,6,0,0,0,0,0,17,17.6,6,50
126,"Liu, Wuge",NID,8,2,2,4,-2,2,0,1,1,0,1,15,13.3,26,38.5
126,"Vestbø, Henrik",STA,6,1,3,4,1,6,0,0,0,0,0,16,6.3,0,0
126,"Thomassen, Mathias Mæland",STA,8,1,3,4,1,2,1,1,0,0,0,9,11.1,0,0
126,"Wessel, Daniel André",SPA,11,4,0,4,-1,0,0,0,0,0,1,16,25,6,33.3
126,"Svendsen, William Konding",STJ,12,0,4,4,-1,4,0,0,0,0,0,6,0,1,100
126,"Daul, Jonas",JAR,8,2,2,4,-11,2,0,1,0,0,1,16,12.5,13,53.8
126,"Melgaard, Noah Fonn",STA,10,2,2,4,9,6,0,0,0,0,0,14,14.3,0,0
126,"West, Henrik Stenrød",JAR,13,0,4,4,-19,4,0,1,0,0,0,11,0,0,0
126,"Bjørnstad, Bendik",STO,10,1,3,4,5,0,1,1,0,1,0,10,10,0,0
126,"Oliversen-Kvamme, Solan Jonathan",SPA,11,0,4,4,-4,14,0,0,0,0,0,4,0,0,0
126,"Myhre, Oliver Hesthagen",LØR,11,3,1,4,-9,0,0,0,0,0,1,25,12,69,53.6
145,"Bakken, Marius Tessem",KON,9,1,2,3,5,27,0,0,0,0,0,12,8.3,0,0
145,"Kvale, Brage",KON,11,1,2,3,-6,0,1,0,0,0,0,13,7.7,0,0
145,"Hasting, Herman Stokka",STA,14,1,2,3,4,2,0,0,0,0,0,14,7.1,3,33.3
145,"Mørk, Mads Henrik",KON,11,0,3,3,-4,4,0,0,0,0,0,7,0,84,39.3
145,"Knaben, Eskil",STA,7,2,1,3,0,29,1,0,0,0,0,13,15.4,34,44.1
145,"Jakobsen, Theodor Liam Strøm",LØR,2,2,1,3,3,2,0,0,0,0,0,10,20,32,59.4
145,"Johansen, Rio Rafael",STO,1,3,0,3,2,0,1,0,0,0,1,4,75,0,0
145,"Høyland, Ludvig",STA,2,1,2,3,-2,0,0,1,0,0,0,4,25,0,0
145,"Hande, Marius",SPA,11,0,3,3,-8,0,0,1,0,0,0,5,0,0,0
145,"Aasheim, Max Marinius",MAN,6,3,0,3,-5,8,1,0,0,0,0,20,15,16,56.3
145,"Hestbråten, Storm",KON,10,2,1,3,-5,4,0,0,0,0,0,14,14.3,0,0
145,"Biagi, Martin Felberg",KON,9,1,2,3,0,0,0,0,0,0,0,8,12.5,25,32
145,"Bie, Christian Markus",STJ,7,0,3,3,2,2,0,0,0,0,0,1,0,28,60.7
145,"Wisth, Johannes",NID,3,3,0,3,-1,6,2,0,0,0,1,9,33.3,0,0
145,"Vågø-Vassbotn, Mathias",NID,6,2,1,3,-4,2,1,1,0,0,0,20,10,102,59.8
145,"Jessesen, Teo Motzfeldt",SPA,10,2,1,3,-8,12,1,0,0,0,0,14,14.3,0,0
145,"Mordal, Daniel Nås",MAN,8,0,3,3,-2,6,0,0,0,0,0,10,0,4,50
145,"Brandt, Brian Gjerlid",STA,4,0,3,3,-3,2,0,1,0,0,0,8,0,0,0
145,"Myhrvold, Dennis Holmestad",LIL,9,1,2,3,-7,27,1,0,0,0,0,2,50,7,57.1
145,"Kristensen, Kasper",STA,10,2,1,3,4,2,0,0,0,0,0,15,13.3,4,50
145,"Rustad, Even",JAR,12,2,1,3,-18,0,1,0,0,0,0,20,10,210,44.8
145,"Frogner-Kyvik, Sebastian",MAN,11,1,2,3,-4,8,0,1,0,0,0,24,4.2,2,50
145,"Pirons, Tomass",STA,12,1,2,3,7,4,0,0,0,0,0,19,5.3,0,0
145,"Wallace, Christoffer André",LØR,13,0,3,3,-2,6,0,0,0,0,0,7,0,0,0
145,"Cellerosi, Viktor Kopperstad",STA,8,2,1,3,2,4,0,1,0,0,0,20,10,100,45
145,"Nilsen, Noah",VÅL,11,0,3,3,1,2,0,0,0,1,0,21,0,7,28.6
145,"Knap, Johan Feragen",MAN,7,1,2,3,-3,2,0,0,0,0,0,4,25,1,100
145,"Krumins, Rodrigo",LIL,13,1,2,3,-5,0,0,0,0,0,0,10,10,104,35.6
173,"Hauge, Sverre",STJ,13,0,2,2,2,27,0,0,0,0,0,7,0,0,0
173,"Barzda, Kristupas",VÅL,8,2,0,2,1,4,0,0,0,0,1,15,13.3,0,0
173,"Bore, Mats Ji-Seong Worren",MAN,10,1,1,2,-8,2,0,0,0,0,0,10,10,45,44.4
173,"Setsaas, Edvard William",NID,10,1,1,2,-11,2,0,0,0,0,0,7,14.3,2,50
173,"Dimitriev-Jensen, Nikolai Georg",STO,2,1,1,2,1,0,0,1,0,0,0,4,25,0,0
173,"Cao, Chunyang Noah",NID,10,1,1,2,-4,8,1,0,0,0,0,7,14.3,0,0
173,"Roca Guinovart, Josep",VÅL,1,1,1,2,2,0,0,0,0,0,0,2,50,0,0
173,"Offenberg, Axel William",STJ,12,0,2,2,5,0,0,0,0,0,0,13,0,0,0
173,"Lysholm, Chris Wikdahl",NID,3,1,1,2,1,0,0,1,0,0,0,13,7.7,1,0
173,"Pedersen, Sebastian Candell",JAR,9,0,2,2,-7,2,0,0,0,0,0,16,0,0,0
173,"Walberg, Lucas Pettersen",SPA,11,1,1,2,-13,2,1,1,0,0,0,13,7.7,121,46.3
173,"Ilseng, Kevin",VÅL,4,0,2,2,3,2,0,0,0,0,0,5,0,0,0
173,"Johansen, Ludvik Jordet",LØR,11,0,2,2,-6,6,0,0,0,0,0,13,0,0,0
173,"Kregnes, Markus",NID,10,2,0,2,-13,6,0,0,0,0,0,11,18.2,0,0
173,"Helgesen, Adrian Solgaard",SPA,11,0,2,2,-4,33,0,0,0,0,0,7,0,0,0
173,"Guimaraes, Bernardo Olav Wadstrand",JAR,10,1,1,2,-25,0,1,1,0,0,0,10,10,84,42.9
173,"Rotegård, Oscar Sanne",MAN,10,0,2,2,-6,2,0,0,0,0,0,2,0,0,0
173,"Karjalainen-Albertsen, Oliver",NID,10,0,2,2,-12,4,0,1,0,0,0,11,0,0,0
173,"Hole-Videsjorden, Even",MAN,6,0,2,2,-4,4,0,0,0,0,0,6,0,2,100
173,"Skaar, Trym",JAR,8,1,1,2,-13,8,0,0,0,0,0,9,11.1,0,0
173,"Larsen, Markus Solvang",LIL,4,1,1,2,0,0,0,0,0,0,0,6,16.7,1,0
173,"Juntti, Jesper Alexandersen",STO,2,0,2,2,3,0,0,0,0,0,0,1,0,0,0
173,"Hågensen, William Burhol",LØR,10,0,2,2,1,4,0,1,0,0,0,2,0,0,0
173,"Bustgaard, Alexander",VÅL,2,1,1,2,2,0,0,0,0,0,0,6,16.7,4,50
173,"Svalastog, Even Wettre",LIL,10,0,2,2,-5,12,0,0,0,0,0,10,0,1,100
173,"Bøe, Melvin René Skjeltorp",SPA,2,1,1,2,-2,0,0,1,0,0,0,5,20,0,0
173,"Skaug, Aksel",VÅL,5,1,1,2,3,0,0,0,0,0,0,4,25,5,40
173,"Kaarbø, Erik",LIL,11,1,1,2,-9,8,1,1,0,0,0,9,11.1,21,47.6
173,"Thorsvik, Sander Bergundhaugen",STA,6,1,1,2,3,2,0,0,0,0,0,10,10,46,54.3
173,"Platou, Sigurd Kvåle",JAR,13,0,2,2,-19,14,0,0,0,0,0,9,0,2,50
173,"Odden, Jørgen Tanum",JAR,10,2,0,2,-23,16,0,0,0,0,0,24,8.3,163,33.7
173,"Haugbro, Heine Tverberg",MAN,4,0,2,2,5,4,0,0,0,0,0,7,0,1,0
173,"Berntsen, Lukas Melien",LØR,8,1,1,2,1,0,0,0,0,0,0,5,20,44,52.3
173,"Olasveengen, Mikael Nyland",STO,1,0,2,2,1,0,0,2,0,0,0,0,0,12,58.3
173,"Hervik, Rasmus Olaisen",JAR,12,1,1,2,-13,12,0,0,0,0,0,5,20,1,0
173,"Wålberg, Jonathan",LIL,8,2,0,2,-1,0,0,0,0,0,0,20,10,10,30
173,"Karlsen, Leander Slind",NID,4,0,2,2,-2,4,0,1,0,0,0,7,0,0,0
173,"Meltveit, Thor-Samuel Rodriguez",KON,3,1,1,2,-2,0,0,0,0,0,0,1,100,0,0
173,"Strandem, Henning",LØR,11,1,1,2,2,4,0,0,0,0,0,11,9.1,0,0
173,"Karfjell, Karl Emil Fiskvik",KON,9,0,2,2,4,6,0,0,0,0,0,5,0,0,0
173,"Wilhelmsen, Theo",NID,6,1,1,2,-2,6,0,0,0,0,0,10,10,99,43.4
173,"Forsberg, Jonas Sætre",LØR,4,0,2,2,0,8,0,0,0,0,0,5,0,44,52.3
173,"Skavhaug, Kornelius Andersen",JAR,13,1,1,2,-15,16,0,0,0,0,0,18,5.6,10,20
216,"Bryni, Joakim Tørmo",STJ,6,1,0,1,2,0,0,0,0,0,0,3,33.3,2,0
216,"Olsen, Mats Sund",LØR,7,0,1,1,0,0,0,0,0,0,0,0,0,35,42.9
216,"Aatlo, Axel Gunnar",JAR,6,0,1,1,-9,0,0,1,0,0,0,6,0,0,0
216,"Hildén, Jonas Westlye",STA,2,0,1,1,1,2,0,0,0,0,0,0,0,1,100
216,"Coard, Mattias Sebastian",KON,10,0,1,1,2,6,0,0,0,0,0,11,0,0,0
216,"Otterlei, Sean-Nikolai Coloma",VÅL,3,1,0,1,0,0,0,0,0,0,0,6,16.7,0,0
216,"Nergård, Berge",VÅL,1,1,0,1,1,0,0,0,0,0,0,1,100,0,0
216,"Blyverket, Mio Bergh",LIL,13,0,1,1,-5,2,0,0,0,0,0,9,0,0,0
216,"Solvang, Fredrik Irgens",JAR,5,0,1,1,-8,6,0,0,0,0,0,6,0,66,43.9
216,"Bråthen, Niklas",STO,9,1,0,1,-1,4,0,0,0,0,0,20,5,1,0
216,"Torstensen, Magnus Langdalen",KON,8,0,1,1,-5,0,0,0,0,0,0,1,0,0,0
216,"Forstrøm, Vegar Magne",VÅL,11,0,1,1,4,4,0,0,0,0,0,9,0,0,0
216,"Hasund, Frithjof",VÅL,4,0,1,1,3,0,0,0,0,0,0,6,0,64,43.8
216,"Bjønnes, Victor Sangiorgio",SPA,1,0,1,1,1,0,0,0,0,0,0,3,0,14,50
216,"Brevik, Aksel",SPA,9,0,1,1,-6,2,0,0,0,0,0,11,0,0,0
216,"Wilberg, Noah Kvarme",NID,10,0,1,1,-8,0,0,0,0,0,0,5,0,2,0
216,"Skjellet, Rasmus Fjærgård",STO,1,0,1,1,3,0,0,0,0,0,0,5,0,0,0
216,"Nielsen, Filip Mains",LØR,3,0,1,1,2,0,0,0,0,0,0,3,0,6,50
216,"Gran, Eskil",VÅL,3,0,1,1,1,0,0,0,0,0,0,3,0,24,33.3
216,"Music, Sanin",NID,10,0,1,1,-10,6,0,0,0,0,0,3,0,0,0
216,"Ulset, Lavrans Vold",FRI,1,1,0,1,1,2,0,0,0,0,0,1,100,15,66.7
216,"Robertsson, Isak Halvari",FRI,1,1,0,1,2,0,0,0,0,0,0,1,100,0,0
216,"Westergård, Sondre Bjørkum",LIL,3,0,1,1,-5,2,0,0,0,0,0,5,0,14,28.6
216,"Grinden, Storm René",KON,2,1,0,1,-1,4,0,0,0,0,0,1,100,0,0
216,"Sveum, Mika",STJ,5,1,0,1,-1,0,0,0,0,0,1,3,33.3,0,0
216,"Vestre, Joakim",LIL,3,0,1,1,1,0,0,0,0,0,0,4,0,4,0
216,"Agnalt, Oliver Borchgrevink",STO,8,1,0,1,10,4,0,0,0,0,0,5,20,0,0
216,"Arnesen, Lucas Marensius",STJ,3,0,1,1,1,0,0,0,0,0,0,0,0,0,0
216,"Andresen, Adrian Escoto",LØR,1,1,0,1,1,2,0,0,0,0,0,6,16.7,3,100
216,"Kristensen, William",JAR,7,1,0,1,-11,4,0,0,0,0,0,11,9.1,3,0
216,"Lunde, Philip Haugen",LIL,13,0,1,1,-10,31,0,1,0,0,0,14,0,1,0
216,"Fenner, Christopher Gjelstad",VÅL,3,1,0,1,0,2,0,0,0,0,0,4,25,0,0
216,"Volla, Oliver Marken",STO,9,0,1,1,5,2,0,0,0,0,0,9,0,0,0
216,"Muzik, Matej",MAN,4,1,0,1,-2,0,0,0,0,0,0,3,33.3,33,48.5
216,"Hadland, Matheo",LIL,11,0,1,1,-11,6,0,0,0,0,0,14,0,196,44.4
216,"Michelet, Henrik",JAR,2,0,1,1,-3,0,0,1,0,0,0,1,0,0,0
216,"Eid, Jakob Marinius Bredland",JAR,8,1,0,1,-7,0,0,0,0,0,0,5,20,1,100
216,"Kristiansen, Jonathan Lund",KON,7,1,0,1,-4,39,0,0,0,0,0,12,8.3,2,0
216,"Østberg, Emil",KON,9,0,1,1,4,0,0,0,0,0,0,8,0,0,0
216,"Moe, Philip Aagesen",KON,11,0,1,1,0,0,0,0,0,0,0,7,0,2,100
256,"Rosales Casillas, Manel",JAR,3,0,0,0,-5,2,0,0,0,0,0,4,0,1,100
256,"Nürnberg, William",JAR,1,0,0,0,-1,0,0,0,0,0,0,0,0,0,0
256,"Sandtangen, Leo",SPA,1,0,0,0,1,2,0,0,0,0,0,0,0,0,0
256,"Brauska, Mark",JAR,13,0,0,0,-22,2,0,0,0,0,0,11,0,1,100
256,"Berg, Sondre",STO,1,0,0,0,0,0,0,0,0,0,0,2,0,0,0
256,"Jerpseth, Markus Rossvoll",LØR,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0
256,"Fristedt, Liam Valentin",KON,5,0,0,0,-1,0,0,0,0,0,0,3,0,0,0
256,"Ohrstrand, Elias Ommedal",STO,1,0,0,0,-2,2,0,0,0,0,0,2,0,2,0
256,"du, Yan",NID,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Figueroa-Ørsnes, Rayco Alexander",NID,2,0,0,0,-1,4,0,0,0,0,0,0,0,0,0
256,"Østli, Andreas",MAN,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0
256,"Finstad-Ødegård, Leon",STO,1,0,0,0,0,0,0,0,0,0,0,3,0,0,0
256,"Fjeld, Simen Treichel",LIL,2,0,0,0,-1,0,0,0,0,0,0,1,0,0,0
256,"Dagsland, Ferdinand",STA,4,0,0,0,2,0,0,0,0,0,0,9,0,0,0
256,"Strengelsrud, Lars Håvard Svarttjernet",KON,3,0,0,0,-2,0,0,0,0,0,0,1,0,8,50
256,"Lennby, Maximilian Vidar",STJ,4,0,0,0,0,0,0,0,0,0,0,3,0,0,0
256,"Lilleaas, Jesper Henriksen",MAN,11,0,0,0,-2,4,0,0,0,0,0,17,0,0,0
256,"Ulrichsen, William Marcelius Evjen",JAR,10,0,0,0,-15,0,0,0,0,0,0,2,0,0,0
256,"Sollien, Elias",STO,2,0,0,0,-1,2,0,0,0,0,0,4,0,0,0
256,"Sagaev, Magomed",JAR,6,0,0,0,-11,2,0,0,0,0,0,1,0,5,60
256,"Brandt, Brian Gjerlid",LIL,4,0,0,0,-1,0,0,0,0,0,0,13,0,0,0
256,"Ramsli, Mark Steinovich",STJ,4,0,0,0,0,0,0,0,0,0,0,5,0,0,0
256,"Johansen, Linus Starheim",MAN,1,0,0,0,0,0,0,0,0,0,0,0,0,5,60
256,"Pettersen, Fredrik",LØR,6,0,0,0,-1,2,0,0,0,0,0,1,0,0,0
256,"Kalinka, Andrej Normann",STO,2,0,0,0,-2,14,0,0,0,0,0,7,0,14,50
256,"Christensen, Anton Nærby",JAR,6,0,0,0,-7,4,0,0,0,0,0,4,0,1,0
256,"Fossen, Olander Andreas",JAR,6,0,0,0,-8,0,0,0,0,0,0,6,0,0,0
256,"Moe, Isak Rambæk",LIL,8,0,0,0,-2,2,0,0,0,0,0,2,0,0,0
256,"Berg, Adam Dahis",NID,9,0,0,0,-5,0,0,0,0,0,0,1,0,12,50
256,"Adsen, Petter Laurits",NID,4,0,0,0,-4,29,0,0,0,0,0,1,0,0,0
256,"Fossum, Marlon",VÅL,3,0,0,0,0,2,0,0,0,0,0,3,0,0,0
256,"Sæther, Marcus Wigdahl",FRI,1,0,0,0,1,4,0,0,0,0,0,0,0,0,0
256,"Rønning, Eskil Laukholm",NID,8,0,0,0,-14,12,0,0,0,0,0,4,0,0,0
256,"Saxrud, Liam Killingrød",STJ,3,0,0,0,-1,2,0,0,0,0,0,1,0,0,0
256,"Arnesen, Johannes Elis",VÅL,2,0,0,0,-1,0,0,0,0,0,0,2,0,17,47.1
256,"Aas, Aleksander Amundsen",NID,4,0,0,0,-6,0,0,0,0,0,0,5,0,0,0
256,"Olsen, Sander Pedersen",KON,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Haugen, Theo",SPA,1,0,0,0,-1,0,0,0,0,0,0,2,0,0,0
256,"Bjørknes, Trym Marius",LØR,3,0,0,0,-1,0,0,0,0,0,0,2,0,0,0
256,"Polzin, Aleksander Thorvaldsen",JAR,7,0,0,0,-12,2,0,0,0,0,0,2,0,0,0
256,"Dabrowski, Hubert",MAN,1,0,0,0,-2,0,0,0,0,0,0,0,0,0,0
256,"Lundberg, Simon Justnes",NID,2,0,0,0,-3,2,0,0,0,0,0,2,0,2,0
256,"Engebrigtsen, Casper",FRI,2,0,0,0,-3,0,0,0,0,0,0,2,0,0,0
256,"Wilberg, Theo Kvarme",NID,10,0,0,0,-14,0,0,0,0,0,1,9,0,71,29.6
256,"Furelid, Felix",NID,10,0,0,0,-10,4,0,0,0,0,0,4,0,21,42.9
256,"Bjarheim, Viktor",KON,5,0,0,0,-2,0,0,0,0,0,0,1,0,2,100
256,"Hveding, Johannes",NID,7,0,0,0,-4,0,0,0,0,0,0,1,0,0,0
256,"Jarberg, Robin",SPA,11,0,0,0,-1,2,0,0,0,0,0,1,0,1,0
256,"Arnestad, Linus Johan Eidsa",LIL,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Bugge-Paulsen, Mads Bahr",JAR,1,0,0,0,-2,2,0,0,0,0,0,0,0,0,0
256,"Reistad-Gysler, Tinius",VÅL,1,0,0,0,0,0,0,0,0,0,0,4,0,3,100
256,"Ballovarre, Aksel",STJ,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Simensen, Lukas",SPA,1,0,0,0,0,0,0,0,0,0,0,3,0,0,0
256,"Olafsen, Casper Opiana",STA,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0
256,"Gjerpe, Florian Eikrem",JAR,1,0,0,0,-2,0,0,0,0,0,0,0,0,0,0
256,"Sandberg, Robin Bergsløkken",KON,3,0,0,0,0,0,0,0,0,0,0,2,0,0,0
256,"Eggers, Sindre",LØR,3,0,0,0,1,0,0,0,0,0,0,2,0,0,0
256,"Risjord, Adrian Stanes",JAR,5,0,0,0,-4,0,0,0,0,0,0,5,0,20,30
256,"Snellingen, Ola",LØR,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0
256,"Ankjell, Alexander Emil",JAR,4,0,0,0,-7,0,0,0,0,0,0,5,0,3,0
256,"Olsen-Bærem, Noah Leander",SPA,2,0,0,0,-1,0,0,0,0,0,0,0,0,0,0
256,"Buberget, Victor",KON,7,0,0,0,0,0,0,0,0,0,0,4,0,0,0
256,"Stenbæk, Heine Hollstedt",MAN,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Solvang-Moran, Casper",LØR,1,0,0,0,2,0,0,0,0,0,0,4,0,0,0
256,"Mortvedt, Oscar Grothe",FRI,5,0,0,0,1,2,0,0,0,0,0,2,0,0,0
256,"Jenssveen, Emil",LIL,11,0,0,0,-6,8,0,0,0,0,0,15,0,0,0
256,"Takala, Elias Juhani",STJ,5,0,0,0,0,2,0,0,0,0,0,6,0,0,0
256,"Svane-Riaz, Noah",MAN,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0
256,"Tronsvang, Noah",NID,2,0,0,0,-3,0,0,0,0,0,0,1,0,0,0
256,"Strand, Håkon Sunde",NID,6,0,0,0,-13,0,0,0,0,0,0,3,0,44,45.5
256,"Dahle, Thomas Behialu",JAR,1,0,0,0,-2,0,0,0,0,0,0,1,0,0,0
256,"Gimmestad, Embrik Midtsand Andersen",NID,10,0,0,0,-7,2,0,0,0,0,0,2,0,3,66.7
256,"Storesund, Felix André",NID,3,0,0,0,-2,4,0,0,0,0,0,2,0,0,0
256,"Hotic-Kvernstad, Arian",NID,10,0,0,0,-4,4,0,0,0,0,0,4,0,70,44.3
256,"Angeltvedt, Eirik",JAR,10,0,0,0,-16,2,0,0,0,0,0,2,0,123,34.1
256,"Hårstad-Evjen, Magnus Nathaniel",FRI,4,0,0,0,0,4,0,0,0,0,0,2,0,0,0
256,"Gulinski, Oskar",LIL,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0
256,"Stoveland, Isak",FRI,2,0,0,0,-1,2,0,0,0,0,0,3,0,0,0
256,"Holen, Vebjørn Olasveen",LIL,12,0,0,0,-6,4,0,0,0,0,0,0,0,0,0
256,"Solhaug, Lukas Trondsen",NID,4,0,0,0,-4,2,0,0,0,0,0,2,0,1,0`;

// ... (Previous constants remain unchanged) ...

export const assignPersonality = (skill: number, aggression: number, vision: number, puckHandling: number, stamina: number): PlayerPersonality => {
    if (aggression > 75 && skill < 60) return PlayerPersonality.ENFORCER;
    if (vision > 70 && puckHandling > 70) return PlayerPersonality.PLAYMAKER;
    if (skill > 75 && aggression < 50) return PlayerPersonality.SNIPER;
    if (stamina > 80 && aggression > 50) return PlayerPersonality.GRINDER;
    if (stamina > 70 && vision > 50 && aggression > 40) return PlayerPersonality.TWOWAY;
    return PlayerPersonality.NONE;
};

export const createPlayer = (position: Position, idPrefix: string, index: number, isWonderkid = false): Player => {
    // Generates procedural player (fallback)
    const firstNames = ["Lars", "Ole", "Magnus", "Henrik", "Kristian", "Anders", "Jonas", "Håkon", "Eirik", "Fredrik"];
    const lastNames = ["Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen"];
    const baseSkill = isWonderkid ? 60 : Math.floor(Math.random() * 40) + 30;
    
    const aggression = Math.floor(Math.random() * 60) + 20;
    const vision = Math.floor(Math.random() * 60) + 20;
    const puckHandling = Math.floor(Math.random() * 60) + 20;
    const stamina = Math.floor(Math.random() * 30) + 60;

    // Added random suffix to prevent duplicate IDs in tight loops
    const uniqueSuffix = Math.floor(Math.random() * 1000000);

    return {
        id: `${idPrefix}-proc-${index}-${Date.now()}-${uniqueSuffix}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        position,
        skill: baseSkill, 
        potential: Math.min(100, baseSkill + 20),
        age: Math.floor(Math.random() * 3) + 16,
        stamina,
        fatigue: 0,
        morale: 80,
        line: 'BENCH',
        aggression,
        vision,
        puckHandling,
        goals: 0, assists: 0, shots: 0, pim: 0,
        trainingFocus: TrainingFocus.GENERAL,
        isInjured: false,
        injuryWeeksLeft: 0,
        personality: assignPersonality(baseSkill, aggression, vision, puckHandling, stamina)
    };
};

// ... (parseCSV and helpers remain unchanged) ...

// 1. Parse CSV safely handling quoted strings "Lastname, Firstname"
const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const row: any = {};
        let currentStr = '';
        let inQuotes = false;
        let colIndex = 0;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row[headers[colIndex]] = currentStr;
                currentStr = '';
                colIndex++;
            } else {
                currentStr += char;
            }
        }
        row[headers[colIndex]] = currentStr;
        
        // Clean up names (remove quotes around "Last, First")
        if (row['Name'] && row['Name'].startsWith('"') && row['Name'].endsWith('"')) {
             row['Name'] = row['Name'].replace(/"/g, '');
        }
        // Format Name: "Last, First" -> "First Last"
        if (row['Name'] && row['Name'].includes(',')) {
            const [last, first] = row['Name'].split(',').map((s:string) => s.trim());
            row['Name'] = `${first} ${last}`;
        }

        return row;
    });
};

// 2. Map CSV Team Codes to Internal IDs
const getTeamId = (csvTeamName: string): string => {
    const map: {[key:string]: string} = {
        'Frisk Asker/NTG': 'frisk', 'FRI': 'frisk',
        'Jar/Jutul': 'jar', 'JAR': 'jar',
        'Kongsvinger': 'kongsvinger', 'KON': 'kongsvinger',
        'Lillehammer Elite/NTG': 'lillehammer', 'LIL': 'lillehammer',
        'Lørenskog/Furuset': 'lorenskog', 'LØR': 'lorenskog',
        'Manglerud Star': 'manglerud', 'MAN': 'manglerud',
        'Nidaros': 'nidaros', 'NID': 'nidaros',
        'Sparta Sarp': 'sparta', 'SPA': 'sparta',
        'Stavanger': 'oilers', 'STA': 'oilers',
        'Stjernen': 'stjernen', 'STJ': 'stjernen',
        'Storhamar YA/Stange': 'storhamar', 'STO': 'storhamar',
        'Vålerenga': 'valerenga', 'VÅL': 'valerenga'
    };
    return map[csvTeamName] || 'unknown';
};

// 3. Logic to calculate Skill/Potential from stats
const calculateSkaterAttributes = (row: any) => {
    const gp = parseInt(row['GP'] || '1');
    const pts = parseInt(row['PTS'] || '0');
    const goals = parseInt(row['G'] || '0');
    const pim = parseInt(row['PIM'] || '0');
    const fo = parseInt(row['FO'] || '0');

    const ppg = pts / (gp || 1);
    
    // Base skill driven by Points Per Game
    // Max PPG in sample is ~2.3. Min is 0.
    // Map 0 -> 35, 2.3 -> 90
    let skill = Math.min(95, 35 + (ppg * 25));
    
    // Aggression driven by PIM
    const aggression = Math.min(99, 20 + (pim * 2));

    // Puck handling driven by Assists/PTS ratio
    const puckHandling = Math.min(95, skill + (Math.random() * 10));
    
    // Position Logic
    let pos = Position.FORWARD;
    // If they take faceoffs, they are likely a Center
    if (fo > 10) pos = Position.CENTER;
    // We don't have explicit Defense data in sample CSV (usually derived from low goals/high TOI, but TOI missing for skaters).
    // We will assign D later to fill roster gaps if needed, or assume low scoring/high PIM players might be D.

    return { skill: Math.floor(skill), aggression, puckHandling, pos };
};

const calculateGoalieAttributes = (row: any) => {
    const svPct = parseFloat(row['SV%'] || '85');
    // Map 85 -> 60 skill, 94 -> 95 skill
    const skill = Math.max(50, Math.min(99, (svPct - 80) * 5));
    return Math.floor(skill);
};


// --- TEAM GENERATION ---

const buildTeamsFromData = (): Team[] => {
    const teamRows = parseCSV(RAW_TEAMS_CSV);
    const goalieRows = parseCSV(RAW_GOALIES_CSV);
    const playerRows = parseCSV(RAW_PLAYERS_CSV);

    const teams: Team[] = teamRows.map((tRow: any) => {
        const id = getTeamId(tRow['TEAM']);
        
        // Colors Map
        const colors: {[key:string]: [string, string]} = {
            'frisk': ['#FFA500', '#000000'],
            'jar': ['#0000FF', '#FF0000'],
            'kongsvinger': ['#FF0000', '#FFFFFF'],
            'lillehammer': ['#FF0000', '#0000FF'],
            'lorenskog': ['#FF0000', '#0000FF'],
            'manglerud': ['#00FF00', '#000000'],
            'nidaros': ['#000000', '#0000FF'],
            'sparta': ['#0000FF', '#FFFFFF'],
            'oilers': ['#000000', '#FFFFFF'],
            'stjernen': ['#FF0000', '#FFFFFF'],
            'storhamar': ['#FFFF00', '#0000FF'],
            'valerenga': ['#0000FF', '#FF0000'],
        };

        return {
            id,
            name: tRow['TEAM'],
            city: tRow['TEAM'].split(' ')[0],
            colors: colors[id] || ['#CCCCCC', '#000000'],
            roster: [],
            wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
            wallet: 10, // Default starter wallet
            // Default Staff
            staff: [
                { id: `coach-${id}`, name: 'Knut "The Whip" Knudsen', role: StaffRole.HEAD_COACH, level: 1, specialty: 'Old School' },
                { id: `asst-${id}`, name: 'Sven Svensen', role: StaffRole.ASSISTANT, level: 1, specialty: 'Drills' },
                { id: `fixer-${id}`, name: 'Rolf "Fixeren" Rolfsen', role: StaffRole.FIXER, level: 1, specialty: 'Deals' }
            ],
            upgrades: { equipmentLevel: 0, swagLevel: 0, facilityLevel: 0 },
            tactics: { style: TacticStyle.BALANCED, aggression: AggressionLevel.MEDIUM }
        };
    });

    // Populate Rosters
    teams.forEach(team => {
        // 1. Goalies
        const teamGoalies = goalieRows.filter((r: any) => getTeamId(r['TEAM']) === team.id);
        teamGoalies.forEach((gRow: any, i: number) => {
            const skill = calculateGoalieAttributes(gRow);
            const stamina = 100;
            team.roster.push({
                id: `real-g-${i}-${gRow['Name'].replace(/\s/g, '')}`,
                name: gRow['Name'],
                position: Position.GOALIE,
                skill,
                potential: Math.min(100, skill + 10),
                age: 16 + Math.floor(Math.random()*3),
                stamina, fatigue: 0, morale: 80,
                line: i === 0 ? 'G1' : 'G2', // First is Starter, Second is Backup
                aggression: 10, vision: 40, puckHandling: 40,
                goals: 0, assists: 0, shots: 0, pim: 0,
                trainingFocus: TrainingFocus.GENERAL,
                isInjured: false, injuryWeeksLeft: 0,
                personality: assignPersonality(skill, 10, 40, 40, stamina)
            });
        });

        // 2. Skaters
        const teamPlayers = playerRows.filter((r: any) => getTeamId(r['Team']) === team.id);
        // Sort raw list by points to prioritize best players
        teamPlayers.sort((a: any, b: any) => parseInt(b['PTS']) - parseInt(a['PTS']));

        const defendersNeeded = 8; 
        let defendersCount = 0;

        teamPlayers.forEach((pRow: any, i: number) => {
            const attr = calculateSkaterAttributes(pRow);
            let pos: Position = attr.pos;
            
            // Simple logic to force D-men since CSV lacks them
            // If player has low points but high PIM, or just filling slots
            if (defendersCount < defendersNeeded && (i > 6 || (pos !== Position.CENTER && Math.random() > 0.5))) {
                pos = Position.DEFENDER;
                defendersCount++;
            }

            const stamina = 80 + Math.floor(Math.random()*20);

            team.roster.push({
                id: `real-p-${i}-${pRow['Name'].replace(/\s/g, '')}`,
                name: pRow['Name'],
                position: pos,
                skill: attr.skill,
                potential: Math.min(100, attr.skill + Math.floor(Math.random() * 15)),
                age: 16 + Math.floor(Math.random()*3),
                stamina, fatigue: 0, morale: 80,
                line: 'BENCH', // Assigned later
                aggression: attr.aggression,
                vision: Math.floor(attr.skill * 0.8),
                puckHandling: attr.puckHandling,
                goals: 0, assists: 0, shots: 0, pim: 0,
                trainingFocus: TrainingFocus.GENERAL,
                isInjured: false, injuryWeeksLeft: 0,
                personality: assignPersonality(attr.skill, attr.aggression, Math.floor(attr.skill * 0.8), attr.puckHandling, stamina)
            });
        });

        // 3. Fill Gaps (Procedural)
        // Ensure 2 Goalies
        while (team.roster.filter(p => p.position === Position.GOALIE).length < 2) {
            const p = createPlayer(Position.GOALIE, team.id, team.roster.length);
            const gCount = team.roster.filter(r => r.position === Position.GOALIE).length;
            p.line = gCount === 0 ? 'G1' : 'G2';
            team.roster.push(p);
        }
        // Ensure 8 Defenders (4 pairs)
        while (team.roster.filter(p => p.position === Position.DEFENDER).length < 8) {
            team.roster.push(createPlayer(Position.DEFENDER, team.id, team.roster.length));
        }
        // Ensure at least 22 total players (2G + 20 Skaters for 4 lines)
        while (team.roster.length < 22) {
             team.roster.push(createPlayer(Position.FORWARD, team.id, team.roster.length));
        }

        // 4. Assign Lines
        const goalies = team.roster.filter(p => p.position === Position.GOALIE).sort((a,b) => b.skill - a.skill);
        const defs = team.roster.filter(p => p.position === Position.DEFENDER).sort((a,b) => b.skill - a.skill);
        const atts = team.roster.filter(p => p.position !== Position.GOALIE && p.position !== Position.DEFENDER).sort((a,b) => b.skill - a.skill);

        // Goalies
        if (goalies[0]) goalies[0].line = 'G1';
        if (goalies[1]) goalies[1].line = 'G2';
        // Others bench
        for(let i=2; i<goalies.length; i++) goalies[i].line = 'BENCH';

        // Defenders
        defs.forEach((p, i) => {
            if (i < 2) p.line = 'L1';
            else if (i < 4) p.line = 'L2';
            else if (i < 6) p.line = 'L3';
            else if (i < 8) p.line = 'L4';
            else p.line = 'BENCH';
        });

        // Attackers
        atts.forEach((p, i) => {
            if (i < 3) p.line = 'L1';
            else if (i < 6) p.line = 'L2';
            else if (i < 9) p.line = 'L3';
            else if (i < 12) p.line = 'L4';
            else p.line = 'BENCH';
        });
    });

    return teams;
};

export const INITIAL_TEAMS = buildTeamsFromData();

export const USER_TEAM_ID = 'valerenga'; // Default, overridden in app state

export const REGIONS = ['Oslo Area', 'Inlandet (Hamar/Lillehammer)', 'West Coast', 'Ostfold', 'Northern Norway'];

export const AVAILABLE_SCOUTS: Scout[] = [
  { id: 's1', name: 'Jens Strakkølle', region: 'Oslo Area', costPerWeek: 1, skill: 3 },
  { id: 's2', name: 'Oddvar "The Eye" O', region: 'Inlandet', costPerWeek: 3, skill: 7 },
  { id: 's3', name: 'Kjell B. Kjell', region: 'West Coast', costPerWeek: 2, skill: 5 },
  { id: 's4', name: 'Rolf Rølp', region: 'Ostfold', costPerWeek: 1, skill: 2 },
  { id: 's5', name: 'Elite Einar', region: 'Any', costPerWeek: 5, skill: 9 },
];

export const SCOUT_MISHAPS = [
  "went to the pub instead of the rink and spent all his Pøkks.",
  "fell asleep on the bus and ended up in Sweden.",
  "forgot his glasses and scouted the Zamboni driver by mistake.",
  "got into an argument about waffle recipes and was banned from the arena.",
  "spent the travel budget on pølse i vaffel."
];

export const DRILLS = [
  { id: TrainingFocus.TECHNICAL, label: 'TECHNICAL', desc: 'Drills puck control & shooting.', icon: '🏒', boosts: 'SKILL', cost: 'STAMINA' },
  { id: TrainingFocus.PHYSICAL, label: 'PHYSICAL', desc: 'Suicide sprints & weights.', icon: '🏋️', boosts: 'STAMINA', cost: 'MORALE' },
  { id: TrainingFocus.REST, label: 'REST', desc: 'Massage and video analysis.', icon: '🛌', boosts: 'MORALE', cost: 'NONE' },
  { id: TrainingFocus.GENERAL, label: 'BALANCED', desc: 'Standard team practice.', icon: '📋', boosts: 'MIXED', cost: 'LOW' }
];

export const DIRTY_DEALS: DirtyDeal[] = [
  { 
    id: 'soda', 
    label: 'Case of Soda', 
    cost: 2, 
    description: 'Bribe the coach with sugary drinks.', 
    minSuccessChance: 0.1, 
    maxSuccessChance: 0.3 
  },
  { 
    id: 'game', 
    label: 'New PlayStation', 
    cost: 5, 
    description: 'The ultimate distraction for a teenager.', 
    minSuccessChance: 0.3, 
    maxSuccessChance: 0.5 
  },
  { 
    id: 'dad', 
    label: 'Weber Grill for Dad', 
    cost: 10, 
    description: 'Win over the father, win the son.', 
    minSuccessChance: 0.5, 
    maxSuccessChance: 0.7 
  },
  { 
    id: 'car', 
    label: 'Used Volvo 240', 
    cost: 20, 
    description: 'Bribe the family with reliable Swedish engineering.', 
    minSuccessChance: 0.7, 
    maxSuccessChance: 0.9 
  },
  { 
    id: 'mom', 
    label: 'Scout Marries Mom', 
    cost: 40, 
    description: 'The nuclear option. Become the step-dad.', 
    minSuccessChance: 0.9, 
    maxSuccessChance: 0.99 
  }
];

export const PENALTY_REASONS = ["Hooking", "Tripping", "Slashing", "Roughing", "Interference", "High Sticking", "Too Many Men"];

export const TACTICAL_STYLES = [
  { id: TacticStyle.BALANCED, label: 'Balanced', desc: 'Standard playstyle.' },
  { id: TacticStyle.DUMP_AND_CHASE, label: 'Dump & Chase', desc: 'Safe, low risk.' },
  { id: TacticStyle.SKILL_CYCLE, label: 'Skill Cycle', desc: 'Possession based.' },
  { id: TacticStyle.COUNTER_ATTACK, label: 'Counter Attack', desc: 'Exploit turnovers.' },
  { id: TacticStyle.TRAP, label: 'Trap', desc: 'Defensive lockdown.' }
];

export const AGGRESSION_LEVELS = [
  { id: AggressionLevel.LOW, label: 'Disciplined', desc: 'Avoid penalties.' },
  { id: AggressionLevel.MEDIUM, label: 'Normal', desc: 'Standard checking.' },
  { id: AggressionLevel.HIGH, label: 'Physical', desc: 'Finish checks.' },
  { id: AggressionLevel.ENFORCER, label: 'Enforcer', desc: 'Intimidate opponents.' }
];

export const generateSchedule = (teams: Team[]): ScheduledMatch[] => {
    const schedule: ScheduledMatch[] = [];
    const teamIds = teams.map(t => t.id);
    const numTeams = teamIds.length;
    const numWeeks = (numTeams - 1) * 2; 

    let rotatingTeams = [...teamIds.slice(1)];
    const fixedTeam = teamIds[0];

    for (let w = 0; w < numWeeks; w++) {
        const weekMatches: ScheduledMatch[] = [];
        const isSecondHalf = w >= (numTeams - 1);
        
        const opponent = rotatingTeams[0];
        weekMatches.push({
            id: `wk${w+1}-${fixedTeam}-${opponent}`,
            week: w + 1,
            homeTeamId: isSecondHalf ? opponent : fixedTeam,
            awayTeamId: isSecondHalf ? fixedTeam : opponent,
            played: false
        });

        for (let i = 1; i < (numTeams / 2); i++) {
            const home = rotatingTeams[i];
            const away = rotatingTeams[rotatingTeams.length - i];
            weekMatches.push({
                id: `wk${w+1}-${home}-${away}`,
                week: w + 1,
                homeTeamId: isSecondHalf ? away : home,
                awayTeamId: isSecondHalf ? home : away,
                played: false
            });
        }

        schedule.push(...weekMatches);
        rotatingTeams.push(rotatingTeams.shift()!);
    }

    return schedule.sort((a,b) => a.week - b.week);
};

// NEW HELPER FOR SEASON TRANSITION
export const replenishRosters = (teams: Team[]): Team[] => {
  return teams.map(team => {
    // 1. Age up & Remove graduates (>18)
    let roster = team.roster
        .map(p => ({...p, age: p.age + 1}))
        .filter(p => p.age <= 18);
    
    // 2. Fill gaps
    // 2 Goalies
    while (roster.filter(p => p.position === Position.GOALIE).length < 2) {
       const p = createPlayer(Position.GOALIE, team.id, roster.length, Math.random() > 0.9);
       p.age = 16; 
       p.line = 'BENCH';
       roster.push(p);
    }
    // 8 Defenders
    while (roster.filter(p => p.position === Position.DEFENDER).length < 8) {
       const p = createPlayer(Position.DEFENDER, team.id, roster.length, Math.random() > 0.9);
       p.age = 16;
       p.line = 'BENCH';
       roster.push(p);
    }
    // 12 Forwards (Total 22)
    while (roster.length < 22) {
       const p = createPlayer(Position.FORWARD, team.id, roster.length, Math.random() > 0.9);
       p.age = 16;
       p.line = 'BENCH';
       roster.push(p);
    }
    
    // 3. Reset stats
    roster = roster.map(p => ({
        ...p,
        goals: 0, assists: 0, shots: 0, pim: 0,
        fatigue: 0, isInjured: false, injuryWeeksLeft: 0
    }));

    // 4. Auto-Assign Lines based on new roster skill
    const goalies = roster.filter(p => p.position === Position.GOALIE).sort((a,b) => b.skill - a.skill);
    const defs = roster.filter(p => p.position === Position.DEFENDER).sort((a,b) => b.skill - a.skill);
    const atts = roster.filter(p => p.position !== Position.GOALIE && p.position !== Position.DEFENDER).sort((a,b) => b.skill - a.skill);

    // Goalies
    goalies.forEach((p, i) => p.line = i === 0 ? 'G1' : i === 1 ? 'G2' : 'BENCH');

    // Defenders
    defs.forEach((p, i) => {
        if (i < 2) p.line = 'L1';
        else if (i < 4) p.line = 'L2';
        else if (i < 6) p.line = 'L3';
        else if (i < 8) p.line = 'L4';
        else p.line = 'BENCH';
    });

    // Attackers
    atts.forEach((p, i) => {
        if (i < 3) p.line = 'L1';
        else if (i < 6) p.line = 'L2';
        else if (i < 9) p.line = 'L3';
        else if (i < 12) p.line = 'L4';
        else p.line = 'BENCH';
    });

    return { 
        ...team, 
        roster,
        wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, 
        goalsFor: 0, goalsAgainst: 0 
    };
  });
};