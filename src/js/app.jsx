var IntroFormHandler = React.createClass({
     render: function() {
          return(
               <div className="jumbotron jumbotron-fluid">
                    {this.props.children}
               </div>
          );
     }
});

IntroFormHandler.Header = React.createClass({
     getDefaultProps: function() {
          return {
               heading: 'To Let!',
               lead: 'Your absolute Real Estate Portal in UK.'
          }
     },
     onFormSubmit: function(e) {
          e.preventDefault();
          
          var input = this.refs.search.value;

          if(input.length > 0) {
               this.refs.search.value = '';
               this.props.newSearch(input);
          }

     },
     render: function() {
          return(
               <div className="container">
                    <div className="row">
                         <div className="col-12 col-md-4 col-sm-6 intro">
                              <h1 className="display-4">{this.props.heading}</h1>
                              <p className="lead">{this.props.lead}</p>
                              <a href="#" className="btn btn-lg btn-primary ctn">Rent your Property out!</a>
                         </div>
                         <div className="col-6 col-sm-6 col-md-3 d-flex icons">
                              <h1 className="icon pr-lg-3 pr-md-0 pt-1-25 text-center home">
                                   <i className="fa fa-home" aria-hidden="true"></i>
                              </h1>
                              <h1 className="icon text-center building">
                                   <i className="fa fa-building" aria-hidden="true"></i>
                              </h1>
                         </div>
                         <div className="col-12 col-sm-12 col-md-5 col-xl-4 push-xl-1 search-field">
                            <div className="bg-transparent p-3 mt-lg-4 rounded">
                                <h2 className="display-5 mb-3">Find your new Home</h2>
                                <form onSubmit={this.onFormSubmit} className="form-group">
                                    <div className="input-group input-group-lg">
                                            <input id="search" type="text" className="form-control" placeholder="I'm searching in..." ref="search" />
                                            <span className="input-group-btn">
                                                <button className="btn btn-primary">Go!</button>
                                            </span>
                                        </div>
                                </form>
                            </div>
                         </div>
                    </div>
               </div>
          );
     }
});


var Flat = React.createClass({
     capitalize: function(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
     },
     render: function() {
          var flat = this.props.flat,
              updatedAt = flat.updated_in_days_formatted,
              priceType = (flat.price_type === "monthly") ? "pcm" : "pw";
          return(
               <div className="card">
                    <img className="card-img-top img-fluid" src={flat.img_url} alt={flat.title}/>
                    <h3 className="card-price">
                         <span className="badge badge-primary">{flat.price_formatted + " " + priceType}</span>
                    </h3>
                    <div className="card-block">
                         <h4 className="card-title">{flat.title}</h4>
                         <p className="lead mb-1 text-primary">Property description</p>
                         <p className="card-text mb-2">{flat.summary}</p>
                         <p className="lead mb-1 text-primary">Property features</p>
                         <p className="card-text mb-1">{flat.keywords}</p>
                         <p className="card-text"><span className="text-primary">Property Type: </span>{this.capitalize(flat.property_type)}</p>
                         <a href={flat.lister_url} className="btn btn-ctn btn-sm" target="_blank">Check it out</a>
                    </div>
                    <div className="card-footer">
                         <small className="text-muted mb-0">{updatedAt === "new!" ? <span className="badge badge-pill badge-lila">NEW</span> : updatedAt}</small>
                    </div>
               </div>
          );
     }
});

var FlatListings = React.createClass({
     render: function() {
          var input = (this.props.input === undefined) ? "London" : this.props.input;
          var flats = this.props.flats.map(function(flat, i) {
               return <Flat key={i} flat={flat} />;
          });
          return(
               <div className="container">
                    <p className="bg-inverse col-12 lead p-2 rounded text-center text-white">Search Results of: <small className="text-info">{input}</small></p>
                    <div className="card-columns">
                         {(flats.length > 0) ? flats : <h4 className="d-inline-block display-5">No Properties available in {input}...</h4>}
                    </div>
               </div>
          );
     }
});

var Copyright = React.createClass({
     getDefaultProps: function() {
          return {
               author: "Hanan Mufti"
          }
     },
     render: function() {
          return(
               <footer className="jumbotron jumbotron-fluid mb-0 mt-5">
                    <div className="container text-center">
                         <p className="mb-3 mt-0 text-primary">Made with <i className="fa fa-heart text-danger"></i> {this.props.author}</p>
                         <a href="https://https://www.nestoria.co.uk">
                              <img src="https://resources.nestimg.com/nestoria/img/pbr_v1.png" alt="powered by nestoria.co.uk" width="200" height="22" />
                         </a>
                    </div>
               </footer>
          )
     }
});

var App = React.createClass({
     getDefaultProps: function() {
          return {
               input: "London"
          }
     },
     getInitialState: function() {
          return {
               source: "https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&place_name=" + this.props.input,
               flats: []
          }
     },
     componentDidMount: function() {
          var _this = this;
          this.serverRequest = 
               axios.get(this.state.source)
                    .then(function(result) {
                         _this.setState({
                              flats: result.data.response.listings
                         });
                    })
     },
     componentWillUnmount: function() {
          this.serverRequest.abort();
     },
     handleInputData: function(input) {
          this.setState({
               input: input
          });
          var _this = this;
          axios.get("https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&place_name=" + input)
               .then(function(res) {
                    _this.setState({
                         flats: res.data.response.listings
                    });
               }).catch(function(err) {
                    console.log(err);
               });
     },
     render: function() {
          return(
               <div>
                    <IntroFormHandler>
                         <IntroFormHandler.Header newSearch={this.handleInputData} />
                    </IntroFormHandler>
                    <FlatListings flats={this.state.flats} input={this.state.input} />
                    <Copyright />
               </div>
          );
     }
});

ReactDOM.render(
     <App />,
     document.getElementById('app')
);