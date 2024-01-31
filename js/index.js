/*TODO
-Suche

**/

let flag = false;
let pokemonList = [];
let pokemonListNew = [];
let loadingProgress = 0;

let maxHP = 0; 
let maxAtt = 0; 
let maxDef = 0; 
let maxSpAtt = 0; 
let maxSpDef = 0; 
let maxSpe = 0;

let selectetPokemon = 0;
let name = "test";
let hp = 0;
let att = 0;
let def = 0;
let spAtt = 0;
let spDef = 0;
let spe = 0;
let height = 0;
let weight = 0;


init();

async function init(){
    await loadPokemonList();

    for (let i = 0; i < pokemonList.length; i++) {
        await pokemonAtribute(pokemonList[i].url);
        await createPokemonCard(i);
        loadingProgress ++;
        progress();
    }

    flag = true;
    $('#loadingScreen').css('display', 'none');
    $('#pokedex').css('display', 'block');
    console.log("maxHP: " + maxHP);
    console.log("maxAtt: " + maxAtt);
    console.log("maxDef: " + maxDef);
    console.log("maxSpAtt: " + maxSpAtt);
    console.log("maxSpDef: " + maxSpDef);
    console.log("maxSpe: " + maxSpe);
    console.log(pokemonList);
    console.log(pokemonListNew);
}

async function loadPokemonList(){
    await $.getJSON('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', function(data) {   //max 898
        pokemonList = data.results;
    });
    return;
}

async function pokemonAtribute(url){
    await $.getJSON(url, function(data) {
        
        pokemon = {name: firstLetterUpperCase(data.name),
                hp: data.stats[0].base_stat,
                att: data.stats[1].base_stat,
                def: data.stats[2].base_stat,
                spAtt: data.stats[3].base_stat,
                spDef: data.stats[4].base_stat,
                spe: data.stats[5].base_stat,
                height: data.height/10,
                weight: data.weight/10,
                type: firstLetterUpperCase(data.types[0].type.name),
                img: imageSelectNew(data)
            };
        maxStats(pokemon);
        pokemonListNew.push(pokemon);
    });
}

function imageSelectNew(data){
    let img = data.sprites.other.dream_world.front_default;
    if(img === null){
        img = data.sprites.front_default;
    }
    if(img === null){
        img = "/img/Pokeball.png";
    }
    return img;
}

function maxStats(pokemon){
    if(maxHP < pokemon.hp){
        maxHP = pokemon.hp;
    }
    if(maxAtt < pokemon.att){
        maxAtt = pokemon.att;
    }
    if(maxDef < pokemon.def){
        maxDef = pokemon.def;
    }
    if(maxSpAtt < pokemon.spAtt){
        maxSpAtt = pokemon.spAtt;
    }
    if(maxSpDef < pokemon.spDef){
        maxSpDef = pokemon.spDef;
    }
    if(maxSpe < pokemon.spe){
        maxSpe = pokemon.spe;
    }
}

function progress(){
    let temp = 0;
    temp = Math.floor(100 / pokemonList.length * loadingProgress);
    $('#loadingBarProgress').css('width', temp +'%');
    $('#loadingName').html(pokemonList[loadingProgress-1].name);
}

async function createPokemonCard(pokemonID){
    let cointainer = document.getElementById('pokemonCardContainer');
    cointainer.insertAdjacentHTML("beforeend",`
        <div class="pokemonCard ${pokemonListNew[pokemonID].type}" id="${pokemonListNew[pokemonID].name}" onclick="myFunction(event)">
            <h1 class="pokemonName">${pokemonListNew[pokemonID].name}</h1>
            <h3 class="pokemonElement">${pokemonListNew[pokemonID].type}</h3>
            <img class="pokemonImage" src="${pokemonListNew[pokemonID].img}">  
        </div>
    `);
}

function imageSelect(pokemon){
    let img = pokemon.sprites.other.dream_world.front_default;
    if(img === null){
        img = pokemon.sprites.front_default;
    }
    if(img === null){
        img = "/img/Pokeball.png";
    }
    return img;
}

function myFunction(event) {
    let name = "";
    //console.log(event.target);
    if(event.target.tagName != "DIV"){
        name = event.target.parentElement.id;
    }else{
        name = event.target.id;
    }
    //console.log(name);
    setInfoStats(name);
}

function closeInfoCard(event){
    if(!event.target.classList.contains('arrowLeft')){
        if(!event.target.classList.contains('arrowRight')){
            $('#pokemonInfoCardBG').css('display', 'none');
            $('#pokemonInfoCard').removeClass(pokemonListNew[selectetPokemon].type);
        }
    }
}

function back(event){
    //console.log(event.target);
    $('#pokemonInfoCard').removeClass(pokemonListNew[selectetPokemon].type);
    selectetPokemon --;
    if(selectetPokemon < 0){
        selectetPokemon = pokemonListNew.length - 1;
    }
    setInfoStats(pokemonListNew[selectetPokemon].name)
}

function forward(event){
    //console.log(event.target);
    $('#pokemonInfoCard').removeClass(pokemonListNew[selectetPokemon].type);
    selectetPokemon ++;
    if(selectetPokemon > pokemonListNew.length - 1){
        selectetPokemon = 0;
    }
    setInfoStats(pokemonListNew[selectetPokemon].name)
}

function setInfoStats(name){
    let pokemonID = 0;

    for(i = 0; i < pokemonListNew.length; i++){
        if(name === pokemonListNew[i].name){
            pokemonID = i;
            break;
        }
    }
    //console.log(pokemonID);
    selectetPokemon = pokemonID;

    name = pokemonListNew[pokemonID].name;
    hp = pokemonListNew[pokemonID].hp*100/maxHP;
    att = pokemonListNew[pokemonID].att*100/maxAtt;
    def = pokemonListNew[pokemonID].def*100/maxDef;
    spAtt = pokemonListNew[pokemonID].spAtt*100/maxSpAtt;
    spDef = pokemonListNew[pokemonID].spDef*100/maxSpDef;
    spe = pokemonListNew[pokemonID].spe*100/maxSpe;
    height = pokemonListNew[pokemonID].height;
    weight = pokemonListNew[pokemonID].weight;

    $('#pokemonInfoCard').addClass(pokemonListNew[pokemonID].type);
    $('#infoName').html(name);
    $('#hpBar').css('height', 100-hp + '%');
    $('#attBar').css('height', 100-att + '%');
    $('#defBar').css('height', 100-def + '%');
    $('#spAttBar').css('height', 100-spAtt + '%');
    $('#spDefBar').css('height', 100-spDef + '%');
    $('#speBar').css('height', 100-spe + '%');
    $('#cardType').html(pokemonListNew[pokemonID].type);
    $('#cardHeight').html(height);
    $('#cardWeight').html(weight);
    $('#cardImage').attr('src', pokemonListNew[pokemonID].img);

    $('#pokemonInfoCardBG').css('display', 'block');
}

function firstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


