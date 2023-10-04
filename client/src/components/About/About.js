import './About.css';

const About = () => {
  //TE DANE MOGĄ BYĆ FECZOWANE Z DATABASE!

  return (
    <div className="about">
      <h1 className="about-header"> ABOUT US </h1>
      <div className="about-1">
        <img className="about-img-1" src="./about-1.jpg" alt="home-main" />
        <div className="about-content">
          <h3 className="about-heading">README</h3>
          <p className="about-para p1">
            We are a team of 4 book lovers, whose aim is to raise awareness of the important role
            that books play in our lives. Books not only feed us with knowledge by stimulating our
            brains, but above all, they give wings to our imagination. Books are full of knowledge,
            joy, happiness and wisdom. They are more than enjoyment - they can transform our lives.
            This website was created to promote the reading of books......
          </p>
        </div>
      </div>
      <div className="about-1">
        <div className="about-2">
          <div className="about-content">
            <h3 className="about-heading">Our place</h3>
            <p className="about-para p2">
            At README, we offer more than just books - we offer an immersive experience. Our cozy library is the perfect spot to read and relax with a cup of coffee. You can also connect with other book lovers through book clubs and author events. Plus, you can even borrow books and take them home with you. Come visit us and enjoy all that we have to offer!
            </p>
          </div>
          <img className="about-img-1" src="./library.jpeg" alt="home-main" />
        </div>
      </div>
      <div className="about-1">
        <img className="about-img-1" src="./man.png" alt="home-main" />
        <div className="about-content">
          <h3 className="about-heading">...SO JOIN US! </h3>
          <p className="about-para p1">
          At README, we're passionate about books, and we believe that everyone should have access to great literature. That's why we're inviting you to join us on our mission to promote reading and literacy around the world. By becoming a member of README, you'll get access to our entire collection of books, as well as exclusive discounts, special offers, and more. So what are you waiting for? Join us today, and discover the joy of reading!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
