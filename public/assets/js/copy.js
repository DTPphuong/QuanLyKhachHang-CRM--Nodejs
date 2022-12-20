function myFunction() {
    const copyText = document.getElementById("myInput");
    copyText.select();
    document.execCommand("copy");
    }