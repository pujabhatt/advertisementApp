//console.log("hello");
var x=5;
//console.log(x)
var i=1;
//print();
function print(){
        setTimeout(function()
        {
            console.log(i);
            i++;
            if(i<10){
                print();
            }
        }
            ,2000);
    
}

function calc(){
    console.log("inside calc");
    return{
        add: function(x,y){
            console.log("inside add");
            return x+y;
        },
        substract: function(x,y){
            return x-y;
        }
    }
}

function map(){
    var y=1;
    console.log("inside map");
      var inc=  function increment(){
        y++;
        console.log("inside increment and y is: "+y);
     
    }
    return inc;
}
var myobj = calc();
//console.log("helo")
var ot=myobj.add(3,6);
console.log(ot);

var myobj1=map();
myobj1();
myobj1();
myobj1();