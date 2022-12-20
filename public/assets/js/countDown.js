$(document).ready(function() {
    let countDown = parseInt($('#countDown').text());
    
    setInterval(function () {
        if (countDown > 0) {
            countDown --;
            document.getElementById("countDown").innerHTML = countDown;
            if(countDown == 0){
                document.getElementById("countDown").innerHTML = 'Mã OTP đã hết hạn';
            }
        }
    }, 1000);
});