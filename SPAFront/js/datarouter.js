$('#xiug_wang').click(function (e) {
    alert(1)
   e.preventDefault();
   douniu.loadTemplateIntoTarget('swig_index.html', {}, 'container');
})