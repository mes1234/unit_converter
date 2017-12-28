$(document).ready(()=>{
    var sourceUnit
    var destUnit 
    var sourceVal
    var destVal
    $.ajax({
        type: 'GET',
        url: "https://murmuring-plains-79418.herokuapp.com:5000/var_list",
        success: (results)=>{
            results.forEach((value)=> {
                $( "#source_units" ).append( '<a class="dropdown-item" id="src_'+value+'" href="#">'+value+'</a>' );   
            });
        }
      });
    $('#source_units').on('click','a',function(){
        var selectedUnit=$(this).text()
        sourceUnit = selectedUnit
        $("#formUserInputName").text("Input in: "+sourceUnit)
        $.post("https://murmuring-plains-79418.herokuapp.com:5000/var_list",{name:selectedUnit},(results)=>{
            $( "#dest_units" ).empty()
            results.forEach((value)=> { 
                $( "#dest_units" ).append( '<a class="dropdown-item" id="dest_'+value.name+'" href="#">'+value.name+'</a>' );   
            });
        })
    })
    $('#dest_units').on('click','a',function(){
        var selectedUnit=$(this).text()
        destUnit = selectedUnit 
        $("#formUserResultName").text("Result in: "+destUnit)
    })
    $('#formUserInput').on('keyup',function(){
        $.post("https://murmuring-plains-79418.herokuapp.com:5000/calculate",{
            sourceunit :sourceUnit,
            destunit : destUnit,
            valtocalculate :$(this).val()
        },(results)=>{
                $('#formUserResult').val( results.res)            
        })
    })
})