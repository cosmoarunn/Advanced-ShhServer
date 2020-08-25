<template>
  <element>
    <div class="mt-2 help-content"   >
    <b-container class="p-5 bv-example-row">
      <div>
        <b-card no-body no-border class="text-left">
          <b-card-header> About HTTPSGen </b-card-header>
          <b-card-text class="p-1">
            <b-container>
              <b-row> 
                <b-col cols="8" > 
                  HTTPSGen server generates public key automatically for you. 
                  If the secure HTTPSGen server is running on the backend you may just sit back and in a few steps you 
                  have your SSL Certifates from LetsEncrypt.
                  <div>
                    <ul class="list-unstyled mt-2">
                      <b-media tag="li">
                        <template v-slot:aside>
                          <b-img blank blank-color="#abc" width="64" alt="placeholder"></b-img>
                        </template>
                        <h5 class="mt-0 mb-1">Why HTTPSGen?</h5>
                        <p class="mb-0">
                          To provide Custom SSL Certificates within no time.  
                        </p>
                      </b-media>

                      <b-media tag="li" class="my-4" style="display:none">
                        <template v-slot:aside>
                        <b-img blank blank-color="#cba" width="64" alt="placeholder"></b-img>
                        </template>

                        <h5 class="mt-0 mb-1">List-based media object</h5>
                        <p class="mb-0">
                          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
                          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
                          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </p>
                      </b-media>

                      <b-media tag="li" style="display:none">
                        <template v-slot:aside>
                          <b-img blank blank-color="#bac" width="64" alt="placeholder"></b-img>
                        </template>

                        <h5 class="mt-0 mb-1">List-based media object</h5>
                        <p class="mb-0">
                          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
                          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
                          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                        </p>
                      </b-media>
                    </ul>
                  </div>
                </b-col>
                <b-col cols="4" >
                </b-col>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </div>
      </b-container>
    </div>
  </element>
</template>
<script>
export default ({
    props: {
        show: { 
            type: Boolean,
            default: false,
            description: 'Show/hide help content'
        }
    }
})
</script>