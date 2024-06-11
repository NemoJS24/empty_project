import React from 'react'

export default function Document() {
  return (
    <div class="container ">
    <div class="row">
      <div class="col-md-8">
          <div class="card" style={{width: "18rem;"}}>
            <ul class="list-group list-group-flush">
              <li class="list-group-item fs-3">Whatsapp</li>
              <li class="list-group-item">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod quisquam nesciunt aliquid harum? Consequatur deleniti adipisci eligendi sed qui iste molestias? Voluptatem, perferendis. Voluptatem officia exercitationem laudantium cum quis voluptatum?</li>
            </ul>
          </div>            
          <div class="card" style={{width: "18rem;"}}>
            <div class="card-body grid gap-3">
              <h5 class="card-title fs-3 m-0">Payload</h5>
              <div class = "d-flex justify-content-start align-items-center gap-1 p-lg-1">
                <span class="badge rounded-pill text-bg-info">Trigger</span>
                <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, numquam!</p>
              </div>
              <div class = "d-flex justify-content-start align-items-center gap-1 p-lg-1">
                <span class="badge rounded-pill text-bg-info">API Key</span>
                <p class="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. commodi.</p>
              </div>
              <div class = "d-flex justify-content-start align-items-center gap-1 p-lg-1">
                <span class="badge rounded-pill text-bg-info">Contact</span>
                <p class="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam.</p>
              </div>
            </div>
          </div>            
        
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Endpoints</h5>
            <div class="container">
              <div class = "d-flex justify-content-start align-items-center gap-1">
                  <a href="#" class="btn-sm btn btn-primary">POST</a>
                  <p class="card-text">/admin/api.2024/-01/customers.json</p>  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
