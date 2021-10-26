var idteam;

$('.addmore').click(function() {
  idteam = $(this).attr('data-id'); 
  console.log(idteam)
});

$('#categoryForm').on('show.bs.modal', function (e) {
    $(this).find('.team_id').val(idteam);
});