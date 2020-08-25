<element>
    <div class="mt-2 help-content" v-if="show"  >
        HTTPSGen server generates public key automatically for you. 
        If the secure HTTPSGen server is running on the backend you may go to next step. 
        Otherwise, generate a new account keypair using openssl and pubout to print your public key!
        <br>
        <ol>
            <li>
                Generate an account private key if you don't have one:<br>
                (KEEP ACCOUNT.KEY SECRET!)<br>
                <code>openssl genrsa 4096 &gt; account.key</code>
            </li>
            <li>
                Print your public key:<br>
                <code>openssl rsa -in account.key -pubout</code>
            </li>
            <li>
                Copy and paste the public key into the box below.<br>
            </li>
        </ol>
    </div>
</element>

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