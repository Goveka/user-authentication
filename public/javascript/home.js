const screenWidth= window.innerWidth;
if(screenWidth < 1023){
    document.addEventListener("DOMContentLoaded",()=>{
         document.querySelectorAll(".limitedParagraph").forEach((paragraph)=>{
            let words = paragraph.textContent.split("");
    
            if (words.length >50){
                paragraph.textContent= words.slice(0,50).join("")+ "...";
            }
        })
    }) 
}else{
    document.addEventListener("DOMContentLoaded",()=>{
         document.querySelectorAll(".limitedParagraph").forEach((paragraph)=>{
            let words = paragraph.textContent.split("");
    
            if (words.length >350){
                paragraph.textContent= words.slice(0,350).join("")+ "...";
            }
        })
    })
}
document.addEventListener("DOMContentLoaded",()=>{
    let paragraph= document.querySelectorAll(".limitedParagraph").forEach((paragraph)=>{
        let words = paragraph.textContent.split("");

        if (words.length >250){
            paragraph.textContent= words.slice(0,250).join("")+ "...";
        }
    })
})

const searchBtn=document.getElementById('searchBtn');

searchBtn.addEventListener('click', (e)=>{
    const searchInput=document.getElementById('searchInput').value.toLowerCase().trim();

    if(searchInput === ""){
        alert("The search input can't be empty")
    }else{
        window.location.href= `/search/${encodeURIComponent(searchInput)}`;
    }

});


// Create an Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src'); // Get the actual image source
        img.setAttribute('src', src); // Set the src attribute to start loading the image
        observer.unobserve(img); // Unobserve the image once it's loaded
      }
    });
  });
  
  // Select all images with the 'lazy' attribute
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  // Initialize the Intersection Observer for lazy loading
  lazyImages.forEach((img) => {
    observer.observe(img);
  });
  