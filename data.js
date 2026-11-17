// Original, expandable category bank. Each topic has 20 playable question phrasings.
const raw = `
Name a country in Europe|france,germany,spain,italy,portugal,poland,greece,norway,sweden,finland,denmark,belgium,netherlands,switzerland,austria,ireland,iceland,ukraine,romania,bulgaria,serbia,croatia,slovakia,slovenia,hungary,czechia,estonia,latvia,lithuania,albania
Name a country in Asia|china,japan,india,south korea,north korea,thailand,vietnam,malaysia,indonesia,philippines,singapore,nepal,bhutan,pakistan,bangladesh,sri lanka,mongolia,kazakhstan,uzbekistan,cambodia,laos,iran,iraq,saudi arabia,israel,jordan
Name a country in Africa|egypt,morocco,algeria,tunisia,libya,nigeria,ghana,kenya,uganda,tanzania,rwanda,ethiopia,somalia,south africa,zimbabwe,zambia,namibia,botswana,senegal,mali,chad,cameroon
Name a country in South America|brazil,argentina,chile,peru,bolivia,ecuador,colombia,venezuela,uruguay,paraguay,guyana,suriname
Name a US state|alabama,alaska,arizona,arkansas,california,colorado,connecticut,delaware,florida,georgia,hawaii,idaho,illinois,indiana,iowa,kansas,kentucky,louisiana,maine,maryland,massachusetts,michigan,minnesota,mississippi,missouri,montana,nebraska,nevada,new hampshire,new jersey,new mexico,new york,north carolina,north dakota,ohio,oklahoma,oregon,pennsylvania,rhode island,south carolina,south dakota,tennessee,texas,utah,vermont,virginia,washington,west virginia,wisconsin,wyoming
Name a US state capital|albany,annapolis,atlanta,augusta,austin,baton rouge,bismarck,boise,boston,carson city,charleston,cheyenne,columbia,columbus,concord,denver,des moines,dover,frankfort,harrisburg,hartford,helena,honolulu,indianapolis,jackson,jefferson city,juneau,lansing,lincoln,little rock,madison,montgomery,montpelier,nashville,oklahoma city,olympia,phoenix,pierre,providence,raleigh,richmond,sacramento,salem,salt lake city,santa fe,springfield,st paul,tallahassee,topeka,trenton
Name a major ocean or sea|pacific,atlantic,indian,arctic,southern,mediterranean,caribbean,red sea,black sea,baltic sea,north sea,arabian sea,coral sea
Name a continent|africa,antarctica,asia,europe,north america,south america,australia
Name a major river|nile,amazon,mississippi,yangtze,ganges,danube,volga,thames,rhine,mekong,congo,colorado,hudson,ohio,indus,wabash,vltava,orinoco,parana,paraguay,magdalena,po,rhone,elbe,oder,loire,seine,tagus,douro,ebro,vistula,don,dnieper,irrawaddy,salween,murray,darling,orange,limpopo,niger,zambezi,okavango,blue nile,white nile,arkansas,tennessee,missouri,red river,st lawrence,fraser,mackenzie,yukon,congo river,volta,senegal river
Name a mountain range|himalayas,andes,rockies,alps,appalachians,pyrenees,ural mountains,atlas mountains,caucasus,sierra nevada
Name a city in California|los angeles,san francisco,san diego,sacramento,san jose,oakland,berkeley,anaheim,irvine,fresno,malibu,long beach,pasadena,palo alto,burbank,santa monica,santa barbara,ventura,oxnard,santa cruz,monterey,carmel by the sea,salinas,stockton,modesto,merced,bakersfield,palm springs,ontario,riverside,san bernardino,rancho cucamonga,fontana,san mateo,redwood city,mountain view,sunnyvale,santa clara,cupertino,santa rosa,napa,vallejo,richmond,concord,walnut creek,antioch,hayward,fremont,union city,alameda,petaluma,redding,chico,visalia,clovis,el cajon,chula vista,escondido,carlsbad,oceanside
Name a New York City borough|manhattan,brooklyn,queens,bronx,staten island
Name a major world city|london,paris,tokyo,new york,rome,berlin,madrid,toronto,sydney,dubai,mumbai,seoul,beijing,shanghai,singapore,cairo,lagos,mexico city,buenos aires,rio de janeiro
Name a planet in our solar system|mercury,venus,earth,mars,jupiter,saturn,uranus,neptune
Name a moon of Jupiter|io,europa,ganymede,callisto,amalthea,himalia,elara,pasiphae,sinope,lysithea
Name a space agency|nasa,esa,jaxa,isro,cnsa,roscosmos,csa,uae space agency
Name a constellation|orion,ursa major,ursa minor,scorpius,leo,gemini,taurus,aries,libra,virgo,sagittarius,aquarius,pisces,cancer,cygnus,lyra,draco
Name a chemical element|hydrogen,helium,lithium,beryllium,boron,carbon,nitrogen,oxygen,fluorine,neon,sodium,magnesium,aluminum,silicon,phosphorus,sulfur,chlorine,argon,potassium,calcium,iron,copper,gold,silver,zinc,uranium,iodine,lead,mercury,tin
Name a noble gas|helium,neon,argon,krypton,xenon,radon,oganesson
Name an alkali metal|lithium,sodium,potassium,rubidium,cesium,francium
Name a renewable energy source|solar,wind,hydropower,geothermal,biomass,tidal,wave
Name a type of cloud|cirrus,cumulus,stratus,nimbus,cumulonimbus,altocumulus,altostratus,cirrostratus,cirrocumulus,stratocumulus,nimbostratus,cumulus congestus,cumulus humilis,anvil cloud,lenticular cloud,mammatus cloud,wall cloud,shelf cloud,contrail,fog
Name a type of precipitation|rain,snow,sleet,hail,drizzle,freezing rain,graupel
Name a part of the human skeleton|skull,cranium,mandible,clavicle,scapula,humerus,radius,ulna,sternum,rib,vertebra,pelvis,femur,patella,tibia,fibula,metatarsal,phalanges
Name a human organ|heart,lungs,brain,liver,kidneys,stomach,small intestine,large intestine,pancreas,spleen,bladder,skin,thyroid,appendix
Name one of the five senses|sight,hearing,touch,taste,smell
Name a blood type|a positive,a negative,b positive,b negative,ab positive,ab negative,o positive,o negative
Name a vitamin|vitamin a,vitamin b1,vitamin b2,vitamin b3,vitamin b6,vitamin b12,vitamin c,vitamin d,vitamin e,vitamin k
Name a mammal|dog,cat,horse,elephant,lion,tiger,whale,dolphin,bat,giraffe,zebra,panda,bear,koala,kangaroo,rabbit,mouse,otter,seal,walrus,hippopotamus,rhinoceros,platypus,echidna,sloth,anteater,armadillo,capybara,quokka,wombat,wallaby,tapir,okapi,lemur,meerkat,mongoose,ferret,weasel,stoat,ermine,caracal,serval,lynx,bobcat,ocelot,jaguar,leopard,cheetah,bison,buffalo,moose,elk,reindeer,caribou,antelope,gazelle,impala,oryx,kudu,saola,takin,goral,quoll,narwhal,porpoise,manatee,dugong,orca,beluga,alpaca,llama,vicuna
Name a bird|eagle,hawk,owl,parrot,robin,pigeon,sparrow,penguin,flamingo,ostrich,peacock,toucan,swan,duck,goose,raven,crow,woodpecker,macaw,stork,pelican,albatross,puffin,kiwi,emu,cassowary,tern,gull,cormorant,ibis,heron,egret,crane,kingfisher,finch,canary,cardinal,blue jay,magpie,starling,swallow,swift,warbler,falcon,kestrel,vulture,condor,osprey,loon,grebe,quail,pheasant,turkey,guinea fowl,parakeet,cockatoo,hummingbird,nightingale,oriole,grackle,titmouse,chickadee,nuthatch
Name a reptile|snake,lizard,crocodile,alligator,turtle,tortoise,iguana,gecko,chameleon,komodo dragon
Name an amphibian|frog,toad,salamander,newt,axolotl,caecilian
Name an insect|ant,bee,wasp,butterfly,moth,beetle,dragonfly,grasshopper,cricket,mosquito,fly,termite,ladybug,praying mantis
Name an animal that lives in the ocean|shark,dolphin,whale,octopus,squid,jellyfish,starfish,sea turtle,seal,sea lion,crab,lobster,shrimp,coral,eel,stingray,clam
Name a dinosaur|tyrannosaurus rex,triceratops,stegosaurus,velociraptor,brachiosaurus,ankylosaurus,diplodocus,allosaurus,spinosaurus,iguanodon
Name a dog breed|golden retriever,labrador retriever,german shepherd,beagle,poodle,bulldog,boxer,dachshund,husky,chihuahua,rottweiler,pug,dalmatian,shiba inu,akita,corgi,border collie,australian shepherd,australian cattle dog,belgian malinois,belgian tervuren,irish setter,english setter,irish wolfhound,greyhound,whippet,borzoi,afghan hound,basset hound,bloodhound,shih tzu,pomeranian,papillon,maltese,havanese,bichon frise,cavalier king charles spaniel,english cocker spaniel,cocker spaniel,springer spaniel,newfoundland,great dane,great pyrenees,bernese mountain dog,saint bernard,samoyed,alaskan malamute,akita inu,basenji,shar pei,boston terrier,jack russell terrier,west highland white terrier,airedale terrier
Name a cat breed|siamese,persian,maine coon,bengal,sphynx,ragdoll,scottish fold,british shorthair,abyssinian,burmese
Name a fruit|apple,banana,orange,pear,peach,plum,grape,mango,pineapple,strawberry,blueberry,raspberry,blackberry,watermelon,cantaloupe,kiwi,papaya,guava,lemon,lime,grapefruit,cherry,dragon fruit,passion fruit,pomegranate,starfruit,lychee,longan,rambutan,durian,jackfruit,persimmon,fig,date,prickly pear,apricot,nectarine,cranberry,gooseberry,elderberry,blackcurrant,redcurrant,mulberry,boysenberry,loganberry,kumquat,clementine,tangerine,mandarin,pomelo,blood orange,plantain,coconut,acai,acerola,kiwano,soursop,cherimoya,feijoa,sapodilla,quince,loquat,medlar,ugli fruit
Name a vegetable|carrot,broccoli,spinach,kale,lettuce,cabbage,onion,garlic,potato,sweet potato,turnip,radish,beet,asparagus,celery,cucumber,zucchini,eggplant,cauliflower,artichoke,arugula,okra,bok choy,brussels sprouts,leek,shallot,scallion,green onion,collard greens,swiss chard,mustard greens,endive,radicchio,watercress,parsnip,rutabaga,kohlrabi,fennel,chayote,jicama,cassava,yam,edamame,green beans,snap peas,snow peas,peas,corn,pumpkin,butternut squash,acorn squash,spaghetti squash,daikon,water chestnut,bamboo shoots,heart of palm,celeriac
Name a type of cheese|cheddar,mozzarella,parmesan,swiss,brie,gouda,feta,provolone,ricotta,goat cheese,blue cheese,pepper jack,monterey jack,gruyere,jarlsberg,limburger,manchego,pecorino romano,asiago,roquefort,camembert,havarti,fontina,mascarpone,stilton,edam,emmental,comte,grana padano,burrata,halloumi,cotija,queso fresco,queso blanco,queso panela,queso oaxaca,neufchatel,cream cheese,blue stilton,parmesan reggiano,gorgonzola,munster,muenster,raclette,reblochon,brie de meaux,chèvre,farmers cheese,curds,cottage cheese,provolone piccante,smoked gouda,gruyère,provolone dolce,red leicester,cheshire,wensleydale,danish blue,kasseri,kefalotyri,paneer,labneh,ricotta salata
Name a pasta shape|spaghetti,penne,rigatoni,linguine,fettuccine,farfalle,macaroni,lasagna,ravioli,tortellini,orzo,rotini,gnocchi,bucatini,angel hair
Name a pizza topping|pepperoni,sausage,mushrooms,onions,peppers,olives,pineapple,ham,bacon,spinach,anchovies,broccoli,garlic,basil,tomatoes
Name an ice cream flavor|vanilla,chocolate,strawberry,mint chocolate chip,cookie dough,cookies and cream,rocky road,butter pecan,pistachio,coffee,caramel,birthday cake
Name a breakfast food|eggs,pancakes,waffles,cereal,oatmeal,toast,bagel,bacon,sausage,yogurt,granola,hash browns,french toast,muffin,omelet,frittata,quiche,breakfast burrito,breakfast sandwich,breakfast tacos,crepes,blintzes,porridge,grits,congee,shakshuka,huevos rancheros,eggs benedict,smoked salmon,lox,cream cheese,cinnamon roll,danish pastry,croissant,scone,banana bread,overnight oats,chia pudding,fruit salad,breakfast potatoes
Name a cooking method|baking,boiling,steaming,grilling,frying,roasting,sauteing,poaching,broiling,braising,smoking,stewing
Name a kitchen utensil|spatula,whisk,ladle,tongs,knife,fork,spoon,peeler,grater,colander,rolling pin,can opener,measuring cup,slotted spoon,wooden spoon,spaghetti spoon,soup ladle,fish spatula,silicone spatula,basting brush,pastry brush,bench scraper,dough scraper,garlic press,citrus zester,lemon squeezer,juicer,mortar and pestle,potato masher,meat tenderizer,kitchen shears,pizza cutter,bread knife,paring knife,chef knife,mandoline,sieve,strainer,funnel,melon baller,ice cream scoop,measuring spoons,thermometer,oven mitt
Name a musical instrument|piano,guitar,bass,drums,violin,viola,cello,trumpet,trombone,saxophone,clarinet,flute,oboe,bassoon,tuba,harmonica,ukulele,banjo,harp,accordion,flugelhorn,tenor saxophone,alto saxophone,baritone saxophone,soprano saxophone,english horn,piccolo,recorder,bagpipes,steel drums,steelpan,conga,bongo,djembe,cajon,vibraphone,glockenspiel,celesta,theremin,synthesizer,keytar,organ,pipe organ,melodica,kalimba,ocarina,concertina,bouzouki,mandolin,dulcimer,erhu,koto,shamisen,guzheng,sitar,tabla,shakuhachi,pan flute,french horn,bass clarinet,contrabassoon,baritone horn,euphonium,didgeridoo,triangle,castanets
Name a musical genre|rock,pop,jazz,blues,hip hop,rap,country,classical,reggae,metal,punk,folk,indie,electronic,house,techno,disco,funk,soul,rnb
Name a music note|a,b,c,d,e,f,g
Name a string instrument|violin,viola,cello,double bass,guitar,harp,ukulele,banjo,mandolin,sitar
Name a percussion instrument|drum,snare drum,bass drum,cymbal,tambourine,triangle,xylophone,marimba,bongos,congas,timpani,cowbell
Name a sport played with a ball|soccer,basketball,football,baseball,softball,volleyball,tennis,golf,rugby,cricket,handball,water polo,bowling,lacrosse,pickleball
Name an Olympic sport|swimming,athletics,gymnastics,fencing,boxing,wrestling,rowing,cycling,tennis,basketball,volleyball,judo,taekwondo,archery,diving,sailing,surfing,skateboarding
Name an NFL team|giants,jets,patriots,cowboys,eagles,commanders,bears,packers,lions,vikings,steelers,browns,bengals,ravens,bills,dolphins,chiefs,raiders,broncos,chargers,texans,colts,titans,jaguars,saints,panthers,falcons,buccaneers,rams,49ers,seahawks,cardinals
Name an NBA team|knicks,nets,celtics,lakers,warriors,bulls,heat,cavaliers,76ers,bucks,nuggets,mavericks,spurs,rockets,suns,clippers,thunder,magic,pacers,hornets,wizards,hawks,pelicans,grizzlies,kings,trail blazers,timberwolves,jazz,raptors,pistons
Name an MLB team|mets,yankees,red sox,dodgers,cubs,white sox,giants,phillies,braves,astros,rangers,mariners,angels,padres,diamondbacks,rockies,cardinals,brewers,pirates,reds,guardians,tigers,twins,royals,rays,blue jays,orioles,nationals,marlins,athletics
Name an NHL team|devils,rangers,islanders,bruins,flyers,penguins,capitals,hurricanes,lightning,panthers,maple leafs,canadiens,senators,sabres,red wings,blackhawks,blues,predators,stars,ducks,kings,sharks,kraken,golden knights,canucks,flames,oilers,jets,avalanche,wild,mammoth,blue jackets
Name a chess piece|king,queen,rook,bishop,knight,pawn
Name a card suit|hearts,diamonds,clubs,spades
Name a board game|monopoly,scrabble,chess,checkers,clue,risk,catan,life,battleship,operation,guess who,connect four,trouble,parcheesi
Name a video game console|playstation 5,playstation 4,xbox series x,xbox one,nintendo switch,nintendo wii,nintendo ds,nintendo 3ds,game boy,steam deck,sega genesis
Name a popular video game|minecraft,fortnite,roblox,among us,terraria,stardew valley,rocket league,mario kart,super smash bros,overwatch,valorant,league of legends,zelda,pokemon,tetris,animal crossing,splatoon,super mario bros,super mario odyssey,grand theft auto,red dead redemption,elden ring,dark souls,celeste,hollow knight,undertale,fall guys,apex legends,call of duty,halo,gears of war,forza horizon,gran turismo,beat saber,guitar hero,just dance,wii sports,pac man,donkey kong,sonic the hedgehog,portal,half life,team fortress 2,counter strike,fallout,skyrim,baldurs gate,diablo,world of warcraft
Name a programming language|javascript,typescript,python,java,c,c++,c sharp,rust,go,ruby,php,swift,kotlin,scala,perl,lua,r,matlab
Name a web browser|chrome,firefox,safari,edge,opera,brave,vivaldi,arc
Name a computer peripheral|keyboard,mouse,monitor,printer,scanner,webcam,microphone,speakers,headphones,trackpad,gamepad
Name a color of the rainbow|red,orange,yellow,green,blue,indigo,violet
Name a shade of blue|navy,sky blue,royal blue,cyan,teal,turquoise,azure,cobalt,indigo,cerulean,periwinkle
Name a type of triangle|equilateral,isosceles,scalene,right,acute,obtuse
Name a geometric shape|circle,square,triangle,rectangle,pentagon,hexagon,heptagon,octagon,nonagon,decagon,oval,parallelogram,trapezoid,rhombus,kite,star,cube,sphere,cone,cylinder,pyramid,prism,torus,ellipsoid,semicircle,crescent,heart,diamond,arrow,octahedron,dodecahedron,icosahedron,tetrahedron,cuboid,hexagonal prism,rectangular prism,quadrilateral,polygon
Name a unit of time|second,minute,hour,day,week,month,year,decade,century,millennium
Name a month of the year|january,february,march,april,may,june,july,august,september,october,november,december
Name a day of the week|monday,tuesday,wednesday,thursday,friday,saturday,sunday
Name a season|spring,summer,autumn,winter
Name a holiday celebrated in the US|new years day,martin luther king jr day,presidents day,valentines day,memorial day,juneteenth,independence day,labor day,halloween,veterans day,thanksgiving,christmas,hanukkah,easter
Name a US president by last name|washington,adams,jefferson,madison,monroe,jackson,van buren,harrison,tyler,polk,taylor,fillmore,pierce,buchanan,lincoln,johnson,grant,hayes,garfield,arthur,cleveland,mckinley,roosevelt,taft,wilson,harding,coolidge,hoover,truman,eisenhower,kennedy,nixon,ford,carter,reagan,bush,clinton,obama,biden,trump
Name a famous scientist|einstein,newton,curie,darwin,galileo,tesla,faraday,bohr,hawking,lovelace,turing,feynman,mendel,pasteur
Name a Shakespeare play|hamlet,macbeth,othello,king lear,romeo and juliet,julius caesar,the tempest,twelfth night,a midsummer nights dream,much ado about nothing,the merchant of venice,as you like it
Name a literary genre|fantasy,science fiction,mystery,thriller,romance,horror,nonfiction,biography,autobiography,historical fiction,poetry,drama
Name a punctuation mark|period,comma,semicolon,colon,question mark,exclamation mark,apostrophe,quotation mark,hyphen,dash,parenthesis,bracket
Name a language spoken in Europe|english,french,german,spanish,italian,portuguese,dutch,swedish,norwegian,danish,finnish,greek,polish,czech,romanian,hungarian,irish
Name a romance language|spanish,french,italian,portuguese,romanian,catalan,galician,occitan
Name a unit of length|millimeter,centimeter,meter,kilometer,inch,foot,yard,mile,nautical mile
Name a unit of mass|milligram,gram,kilogram,ounce,pound,ton,tonne
Name a type of weather|sunny,cloudy,rainy,snowy,windy,foggy,stormy,humid,dry,hail,sleet
Name a natural disaster|earthquake,tsunami,tornado,hurricane,typhoon,flood,drought,wildfire,volcanic eruption,landslide,avalanche,blizzard
Name a gemstone|diamond,ruby,sapphire,emerald,amethyst,opal,topaz,garnet,aquamarine,peridot,turquoise,quartz
Name a precious metal|gold,silver,platinum,palladium,rhodium,iridium,osmium,ruthenium
Name a flower|rose,tulip,daisy,sunflower,lily,orchid,daffodil,iris,violet,lavender,peony,marigold,chrysanthemum,poppy,hydrangea,hibiscus,geranium,petunia,begonia,azalea,rhododendron,gardenia,magnolia,camellia,foxglove,bluebell,snapdragon,cosmos,zinnia,aster,anemone,ranunculus,dahlia,gladiolus,forget me not,baby breath,carnation,freesia,jasmine,wisteria,honeysuckle,lilac,lupine,delphinium,hollyhock,primrose,heather,lotus,water lily
Name a tree|oak,maple,pine,birch,willow,cedar,redwood,sequoia,palm,elm,ash,spruce,fir,apple tree,cherry tree,sycamore,hickory,chestnut,walnut,beech,aspen,poplar,cypress,juniper,hemlock,larch,magnolia,dogwood,hawthorn,holly,eucalyptus,baobab,olive,fig,persimmon,pear tree,peach tree,plum tree,lemon tree,lime tree,orange tree,grapefruit tree,pecan,acacia,locust,teak,mahogany,balsa
Name an item found in a classroom|desk,chair,whiteboard,marker,pencil,pen,eraser,ruler,notebook,textbook,calculator,backpack,projector,computer,glue,scissors
Name something at a beach|sand,waves,shells,umbrella,towel,sunscreen,surfboard,beach ball,sunglasses,flip flops,seaweed,lifeguard
Name a form of transportation|car,bus,train,subway,tram,bicycle,motorcycle,airplane,helicopter,boat,ship,ferry,taxi,scooter
Name an airport code|jfk,lga,ewr,lax,sfo,ord,atl,dfw,den,sea,mia,bos,phl,las,mco,iah,dtw,clt,msy
Name a social media platform|instagram,tiktok,snapchat,youtube,facebook,reddit,pinterest,linkedin,discord,tumblr,threads,bluesky
Name a streaming service|netflix,hulu,disney plus,max,prime video,apple tv plus,paramount plus,peacock,crunchyroll
Name a movie genre|comedy,drama,action,adventure,horror,thriller,romance,documentary,animation,fantasy,science fiction,musical,western
Name a superhero|superman,batman,wonder woman,spider man,iron man,thor,hulk,black widow,black panther,flash,aquaman,doctor strange,scarlet witch,captain america
Name a fictional wizard|harry potter,hermione granger,ron weasley,dumbledore,gandalf,saruman,merlin,voldemort
Name a Disney animated film|the lion king,aladdin,frozen,moana,encanto,mulan,beauty and the beast,the little mermaid,tarzan,hercules,pocahontas,snow white,cinderella,pinocchio
Name a Pixar movie|toy story,finding nemo,monsters inc,the incredibles,cars,ratatouille,wall e,up,inside out,coco,soul,luca,turning red,elemental
Name a superhero team|avengers,justice league,x men,fantastic four,teen titans,guardians of the galaxy,doom patrol
Name a type of dance|ballet,hip hop,jazz,tap,salsa,tango,waltz,breakdance,contemporary,ballroom,swing,flamenco,bachata,merengue,cha cha,rumba,foxtrot,quickstep,polka,bolero,belly dance,modern dance,liturgical dance,irish stepdance,highland dance,line dancing,square dance,contra dance,krumping,popping,locking,voguing,waacking,shuffle,dubstep dance,house dance
Name a type of footwear|sneakers,boots,sandals,slippers,heels,flats,loafers,cleats,flip flops,clogs
Name a clothing accessory|belt,hat,scarf,gloves,tie,bow tie,sunglasses,watch,bracelet,necklace,earrings,backpack,headband,bandana,beanie,baseball cap,beret,bucket hat,earmuffs,mittens,suspenders,pocket square,cufflinks,lapel pin,brooch,anklet,ring,handbag,purse,tote bag,clutch,wallet,keychain,hair clip,hair tie,scrunchie,turban,shawl,poncho,leg warmers,arm warmers
Name a job in a hospital|doctor,nurse,surgeon,radiologist,pharmacist,therapist,paramedic,technician,anesthesiologist,dietitian
Name an emergency service|police,fire department,ambulance,coast guard,search and rescue
Name an occupation in a school|teacher,principal,counselor,librarian,nurse,coach,janitor,secretary,substitute teacher
Name a type of building|house,apartment,skyscraper,school,hospital,library,museum,stadium,church,temple,mosque,castle,warehouse,factory
Name a common household appliance|refrigerator,freezer,oven,stove,microwave,dishwasher,washing machine,dryer,toaster,blender,vacuum,air conditioner,fan
Name a room in a house|kitchen,living room,dining room,bedroom,bathroom,basement,attic,garage,laundry room,office,studio,sunroom,music room,game room,playroom,home theater,home cinema,media room,den,family room,guest room,guest bedroom,master bedroom,primary bedroom,nursery,pantry,mudroom,foyer,entryway,entrance hall,hallway,landing,stairwell,closet,walk in closet,dressing room,home gym,gym,exercise room,workout room,craft room,art room,art studio,recording studio,home studio,home office,study,library,reading room,workshop,utility room,storage room,cellar,wine cellar,wine room,breakfast nook,breakfast room,sitting room,parlor,loft,bonus room,rec room,recreation room,billiards room,pool room,bar,home bar,sauna,spa,greenhouse,conservatory,screened porch,porch,laundry,half bath,powder room,guest bathroom,ensuite,walk in pantry,butlers pantry,vestibule,solarium,atrium,computer room,prayer room,meditation room,sun porch,upstairs bathroom,downstairs bathroom
Name a piece of furniture|sofa,couch,chair,table,desk,bed,dresser,wardrobe,bookshelf,nightstand,ottoman,stool,bench
Name a type of candy|chocolate,gummy bears,lollipop,caramel,licorice,taffy,jelly beans,marshmallow,toffee,candy corn,skittles,starburst,snickers,twix,milky way,mars bar,kit kat,reeses,reeses pieces,m and ms,nerds,warheads,sour patch kids,airheads,swedish fish,twizzlers,peeps,jolly ranchers,mentos,smarties,tootsie roll,tootsie pop,ring pop,pop rocks,butterfinger,baby ruth,almond joy,mounds,heath bar,hersheys kisses
Name a type of bread|sourdough,rye,whole wheat,white bread,baguette,ciabatta,focaccia,pita,naan,brioche,bagel,english muffin
Name a sandwich filling|turkey,ham,cheese,tuna,peanut butter,jelly,chicken,egg salad,bacon,lettuce,tomato,avocado,roast beef,pastrami,corned beef,brisket,salami,pepperoni,prosciutto,capicola,mortadella,hummus,grilled vegetables,roasted peppers,provolone,swiss cheese,mozzarella,cheddar,eggplant,meatballs,shrimp,crab,lobster,smoked salmon,cream cheese,grilled chicken,pulled pork,coleslaw,pickles,mustard,mayonnaise,tzatziki,falafel
Name a fast food restaurant|mcdonalds,burger king,wendys,taco bell,chipotle,subway,popeyes,kfc,chick fil a,shake shack,five guys,arbys
Name a soft drink|coca cola,pepsi,sprite,fanta,dr pepper,mountain dew,root beer,ginger ale,7up,orange soda
Name a flavor of tea|earl grey,english breakfast,green tea,black tea,chamomile,peppermint,hibiscus,oolong,jasmine,chai
`;
const base=raw.trim().split('\n').map((line,id)=>{const [prompt,answerLine]=line.split('|');return {id,prompt,answers:answerLine.split(',').filter(Boolean)}});
const starters=['Name','List','Type','Think of','Give me','Enter','Identify','Can you name','Can you list','Write','Supply','Provide','Find','Tell me','Come up with','Choose','Pick','Say','Submit','What is'];
// Distinct canonical answers are reused across natural question phrasings.
export const questions=base.flatMap((q)=>starters.map((start,i)=>({...q,id:q.id*starters.length+i,prompt:start==='What is'?q.prompt.replace(/^Name (a|an|one of the) /,'What is a ').replace(/^Name /,'What is '):q.prompt.replace(/^Name /,start+' ')})));
export const QUESTION_COUNT=questions.length;
export function normalize(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]/g,'');}
const aliases={sunrm:'sunroom',sunrom:'sunroom',studoi:'studio',studyo:'studio',recordingroom:'recordingstudio',homecinema:'hometheater',livingrm:'livingroom',bedrm:'bedroom',bathrm:'bathroom',recroom:'recreationroom',gameroom:'gameroom',usa:'unitedstates',uk:'unitedkingdom',czechrepublic:'czechia',russia:'russianfederation',stpaul:'saintpaul',spiderman:'spiderman',trex:'tyrannosaurusrex',nygiants:'giants',nyjets:'jets',la:'losangeles',nyc:'newyork'};
function distance(a,b){if(Math.abs(a.length-b.length)>2)return 3;let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[b.length]}
export function matchAnswer(text,accepted){let n=normalize(text);n=aliases[n]||n;if(!n)return null;for(let i=0;i<accepted.length;i++){let v=normalize(accepted[i]);if(v===n)return {answer:accepted[i],index:i,typo:false}}for(let i=0;i<accepted.length;i++){let v=normalize(accepted[i]);let d=distance(n,v);if(n.length>=5&&v.length>=5&&d<=((n.length>=9&&v.length>=9)?2:1))return {answer:accepted[i],index:i,typo:true}}return null}
export const wordList=['CRANE','SLATE','PLANT','BRAVE','OCEAN','MUSIC','LIGHT','DREAM','BRAIN','SUGAR','CLOUD','RIVER','STONE','FRUIT','TABLE','TRAIN','GHOST','SHINE','FLAME','SPACE','GRAPE','SHEEP','WATER','PIANO','ROBOT','BEACH','GREEN','QUEST','SMILE','HOUSE','WORLD','HEART','NIGHT','SOUND','TIGER','APPLE','POINT','WHALE','LEMON','BREAD','PIZZA','SCORE','DANCE','GAMES','SNAKE','CROWN','POWER','STORM','HONEY','MAGIC','LEVEL','BLOOM','BERRY','SHELF','BRICK','LAUGH','CHESS','EARTH','SOLAR','METAL','FROST','CANDY','TRACK','FIELD','BLADE','HAPPY','FRESH','LUNCH','PULSE','SPEED','START','FINAL','ROUND','ROYAL','SMART','FLOOR','CHAIR','SLEEP','CLOCK','MOUSE','PHONE','PAINT','PAPER','PLANE','SHARK','HORSE','SWEET','DRIVE','RHYME','VALUE','MONEY','SMOKE','FIRES','SPARK','BIRDS','PEARL','RANCH','WAVES','TOWEL'];
export const groups=[
[['MERCURY','VENUS','EARTH','MARS'],['BLUE','GREEN','RED','YELLOW'],['APPLE','BANANA','PEAR','PEACH'],['ROCK','JAZZ','POP','BLUES']],
[['EAGLE','ROBIN','SWAN','CROW'],['OAK','PINE','MAPLE','BIRCH'],['BASS','DRUM','PIANO','FLUTE'],['SOCCER','TENNIS','GOLF','RUGBY']],
[['NILE','AMAZON','DANUBE','THAMES'],['RUBY','OPAL','PEARL','TOPAZ'],['MONDAY','FRIDAY','SUNDAY','TUESDAY'],['CIRCLE','SQUARE','OVAL','TRIANGLE']],
[['SHARK','WHALE','SEAL','DOLPHIN'],['GOLD','IRON','SILVER','COPPER'],['SPRING','SUMMER','AUTUMN','WINTER'],['SALT','PEPPER','SUGAR','CINNAMON']],
[['TOKYO','PARIS','ROME','LONDON'],['HORROR','COMEDY','DRAMA','ACTION'],['PIZZA','PASTA','SALAD','SOUP'],['ORANGE','PURPLE','CYAN','PINK']],
[['BISHOP','KNIGHT','ROOK','PAWN'],['SAPPHIRE','EMERALD','RUBY','DIAMOND'],['TIGER','LION','LEOPARD','JAGUAR'],['SATURN','JUPITER','URANUS','NEPTUNE']]
];
export const groupLabels=[
['Inner planets','Colors','Fruits','Music genres'],
['Birds','Trees','Instruments','Sports'],
['Rivers','Gemstones','Days of the week','Shapes'],
['Marine mammals and fish','Metals','Seasons','Seasonings'],
['World capitals','Movie genres','Foods','Colors'],
['Chess pieces','Gemstones','Big cats','Outer planets']
];