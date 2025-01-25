import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  if (process.env.SIMPLCMS_DB_PROVIDER) redirect("/setup/oauth");
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center  space-y-12 bg-background text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
      </div>

      <p>Select a Database Provider</p>
      <div className="grid grid-cols-3 gap-4">
        <Link href="/setup/mongo">
          <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
            <CardContent className="p-0 ">
              <MongoDBLogo />
            </CardContent>
          </Card>
        </Link>

        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <DynamoDBLogo />
          </CardContent>
        </Card>
        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <SupabaseLogo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SupabaseLogo() {
  return (
    <svg
      width="150"
      height="113"
      viewBox="0 0 581 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M151.397 66.7608C151.996 72.3621 157.091 81.9642 171.877 81.9642C184.764 81.9642 190.959 73.7624 190.959 65.7607C190.959 58.559 186.063 52.6577 176.373 50.6571L169.379 49.1569C166.682 48.6568 164.884 47.1565 164.884 44.7559C164.884 41.9552 167.681 39.8549 171.178 39.8549C176.772 39.8549 178.87 43.5556 179.27 46.4564L190.359 43.9558C189.76 38.6546 185.064 29.7527 171.078 29.7527C160.488 29.7527 152.696 37.0543 152.696 45.8561C152.696 52.7576 156.991 58.4591 166.482 60.5594L172.976 62.0598C176.772 62.8599 178.271 64.6605 178.271 66.8609C178.271 69.4615 176.173 71.762 171.777 71.762C165.983 71.762 163.085 68.1611 162.786 64.2602L151.397 66.7608Z"
        fill="#1F1F1F"
      />
      <path
        d="M233.421 80.4639H246.109C245.909 78.7635 245.609 75.3628 245.609 71.5618V31.2529H232.321V59.8592C232.321 65.5606 228.925 69.5614 223.031 69.5614C216.837 69.5614 214.039 65.1604 214.039 59.6592V31.2529H200.752V62.3599C200.752 73.0622 207.545 81.7642 219.434 81.7642C224.628 81.7642 230.325 79.7638 233.022 75.1627C233.022 77.1631 233.221 79.4636 233.421 80.4639Z"
        fill="#1F1F1F"
      />
      <path
        d="M273.076 99.4682V75.663C275.473 78.9636 280.469 81.6644 287.263 81.6644C301.149 81.6644 310.439 70.6617 310.439 55.7584C310.439 41.1553 302.148 30.1528 287.762 30.1528C280.37 30.1528 274.875 33.4534 272.677 37.2544V31.253H259.79V99.4682H273.076ZM297.352 55.8585C297.352 64.6606 291.958 69.7616 285.164 69.7616C278.372 69.7616 272.877 64.5605 272.877 55.8585C272.877 47.1566 278.372 42.0554 285.164 42.0554C291.958 42.0554 297.352 47.1566 297.352 55.8585Z"
        fill="#1F1F1F"
      />
      <path
        d="M317.964 67.0609C317.964 74.7627 324.357 81.8643 334.848 81.8643C342.139 81.8643 346.835 78.4634 349.332 74.5625C349.332 76.463 349.532 79.1635 349.832 80.4639H362.02C361.72 78.7635 361.422 75.2627 361.422 72.6622V48.4567C361.422 38.5545 355.627 29.7527 340.043 29.7527C326.855 29.7527 319.761 38.2544 318.963 45.9562L330.751 48.4567C331.151 44.1558 334.348 40.455 340.141 40.455C345.737 40.455 348.434 43.3556 348.434 46.8564C348.434 48.5568 347.536 49.9572 344.738 50.3572L332.65 52.1576C324.458 53.3579 317.964 58.2589 317.964 67.0609ZM337.644 71.962C333.349 71.962 331.25 69.1614 331.25 66.2608C331.25 62.4599 333.947 60.5594 337.345 60.0594L348.434 58.359V60.5594C348.434 69.2615 343.239 71.962 337.644 71.962Z"
        fill="#1F1F1F"
      />
      <path
        d="M387.703 80.4641V74.4627C390.299 78.6637 395.494 81.6644 402.288 81.6644C416.276 81.6644 425.467 70.5618 425.467 55.6585C425.467 41.0552 417.174 29.9528 402.788 29.9528C395.494 29.9528 390.1 33.1535 387.902 36.6541V8.04785H374.815V80.4641H387.703ZM412.178 55.7584C412.178 64.7605 406.784 69.7616 399.99 69.7616C393.297 69.7616 387.703 64.6606 387.703 55.7584C387.703 46.7564 393.297 41.8554 399.99 41.8554C406.784 41.8554 412.178 46.7564 412.178 55.7584Z"
        fill="#1F1F1F"
      />
      <path
        d="M432.99 67.0609C432.99 74.7627 439.383 81.8643 449.873 81.8643C457.165 81.8643 461.862 78.4634 464.358 74.5625C464.358 76.463 464.559 79.1635 464.858 80.4639H477.046C476.748 78.7635 476.448 75.2627 476.448 72.6622V48.4567C476.448 38.5545 470.653 29.7527 455.068 29.7527C441.881 29.7527 434.788 38.2544 433.989 45.9562L445.776 48.4567C446.177 44.1558 449.374 40.455 455.167 40.455C460.763 40.455 463.46 43.3556 463.46 46.8564C463.46 48.5568 462.561 49.9572 459.763 50.3572L447.676 52.1576C439.484 53.3579 432.99 58.2589 432.99 67.0609ZM452.671 71.962C448.375 71.962 446.276 69.1614 446.276 66.2608C446.276 62.4599 448.973 60.5594 452.371 60.0594L463.46 58.359V60.5594C463.46 69.2615 458.265 71.962 452.671 71.962Z"
        fill="#1F1F1F"
      />
      <path
        d="M485.645 66.7608C486.243 72.3621 491.339 81.9642 506.124 81.9642C519.012 81.9642 525.205 73.7624 525.205 65.7607C525.205 58.559 520.311 52.6577 510.62 50.6571L503.626 49.1569C500.929 48.6568 499.132 47.1565 499.132 44.7559C499.132 41.9552 501.928 39.8549 505.425 39.8549C511.021 39.8549 513.118 43.5556 513.519 46.4564L524.607 43.9558C524.007 38.6546 519.312 29.7527 505.326 29.7527C494.735 29.7527 486.944 37.0543 486.944 45.8561C486.944 52.7576 491.238 58.4591 500.73 60.5594L507.224 62.0598C511.021 62.8599 512.519 64.6605 512.519 66.8609C512.519 69.4615 510.421 71.762 506.025 71.762C500.23 71.762 497.334 68.1611 497.034 64.2602L485.645 66.7608Z"
        fill="#1F1F1F"
      />
      <path
        d="M545.385 50.2571C545.685 45.7562 549.482 40.5549 556.375 40.5549C563.967 40.5549 567.165 45.3561 567.365 50.2571H545.385ZM568.664 63.0601C567.065 67.4609 563.668 70.5617 557.474 70.5617C550.88 70.5617 545.385 65.8606 545.087 59.3593H580.252C580.252 59.159 580.451 57.1587 580.451 55.2582C580.451 39.4547 571.361 29.7527 556.175 29.7527C543.588 29.7527 531.998 39.9548 531.998 55.6584C531.998 72.262 543.886 81.9642 557.374 81.9642C569.462 81.9642 577.255 74.8626 579.753 66.3607L568.664 63.0601Z"
        fill="#1F1F1F"
      />
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#paint1_linear)"
        fillOpacity="0.2"
      />
      <path
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="53.9738"
          y1="54.974"
          x2="94.1635"
          y2="71.8295"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="36.1558"
          y1="30.578"
          x2="54.4844"
          y2="65.0806"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DynamoDBLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="80px"
        height="80px"
        viewBox="0 0 80 80"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Icon-Architecture/64/Arch_Amazon-DynamoDB_64</title>
        <desc>Created with Sketch.</desc>
        <defs>
          <linearGradient
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
            id="linearGradient-1"
          >
            <stop stopColor="#2E27AD" offset="0%"></stop>
            <stop stopColor="#527FFF" offset="100%"></stop>
          </linearGradient>
        </defs>
        <g
          id="Icon-Architecture/64/Arch_Amazon-DynamoDB_64"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Icon-Architecture-BG/64/Database"
            fill="url(#linearGradient-1)"
          >
            <rect id="Rectangle" x="0" y="0" width="80" height="80"></rect>
          </g>
          <path
            d="M52.0859525,54.8502506 C48.7479569,57.5490338 41.7449661,58.9752927 35.0439749,58.9752927 C28.3419838,58.9752927 21.336993,57.548042 17.9999974,54.8492588 L17.9999974,60.284515 L18.0009974,60.284515 C18.0009974,62.9952002 24.9999974,66.0163299 35.0439749,66.0163299 C45.0799617,66.0163299 52.0749525,62.9991676 52.0859525,60.290466 L52.0859525,54.8502506 Z M52.0869525,44.522272 L54.0869499,44.5113618 L54.0869499,44.522272 C54.0869499,45.7303271 53.4819507,46.8580436 52.3039522,47.8905439 C53.7319503,49.147199 54.0869499,50.3800499 54.0869499,51.257824 C54.0869499,51.263775 54.0859499,51.2687342 54.0859499,51.2746852 L54.0859499,60.284515 L54.0869499,60.284515 C54.0869499,65.2952658 44.2749628,68 35.0439749,68 C25.8349871,68 16.0499999,65.3071678 16.003,60.3192292 C16.003,60.31427 16,60.3093109 16,60.3043517 L16,51.2548485 C16,51.2528648 16.002,51.2498893 16.002,51.2469138 C16.005,50.3691398 16.3609995,49.1412479 17.7869976,47.8875684 C16.3699995,46.6358725 16.01,45.4149236 16.001,44.5440924 L16.002,44.5440924 C16.002,44.540125 16,44.5371495 16,44.5331822 L16,35.483679 C16,35.4807035 16.002,35.477728 16.002,35.4747525 C16.005,34.5969784 16.3619995,33.3690866 17.7879976,32.1173908 C16.3699995,30.8647031 16.01,29.6427623 16.001,28.7729229 L16.002,28.7729229 C16.002,28.7689556 16,28.7649882 16,28.7610209 L16,19.7125095 C16,19.709534 16.002,19.7065585 16.002,19.703583 C16.019,14.6997751 25.8199871,12 35.0439749,12 C40.2549681,12 45.2609615,12.8281823 48.7779569,14.2722941 L48.0129579,16.1052054 C44.7299622,14.7573015 40.0029684,13.9836701 35.0439749,13.9836701 C24.9999882,13.9836701 18.0009974,17.0047998 18.0009974,19.7174687 C18.0009974,22.4291458 24.9999882,25.4502754 35.0439749,25.4502754 C35.3149746,25.4532509 35.5799742,25.4502754 35.8479739,25.4403571 L35.9319738,27.4220435 C35.6359742,27.4339456 35.3399745,27.4339456 35.0439749,27.4339456 C28.3419838,27.4339456 21.336993,26.0066949 18,23.3079117 L18,28.7401923 L18.0009974,28.7401923 L18.0009974,28.7630046 C18.0109974,29.8034395 19.0779959,30.7119605 19.9719948,31.2892085 C22.6619912,33.0040913 27.4819849,34.1754485 32.8569778,34.4184481 L32.7659779,36.4001346 C27.3209851,36.1531677 22.5529914,35.0234675 19.4839954,33.2917235 C18.7279964,33.8570695 18.0009974,34.6217743 18.0009974,35.4886382 C18.0009974,38.2003153 24.9999882,41.2214449 35.0439749,41.2214449 C36.0289736,41.2214449 37.0069723,41.1887143 37.9519711,41.1232532 L38.0909709,43.1019642 C37.1009722,43.1704008 36.0749736,43.205115 35.0439749,43.205115 C28.3419838,43.205115 21.336993,41.7778644 18,39.0790811 L18,44.5113618 L18.0009974,44.5113618 C18.0109974,45.574609 19.0779959,46.4821381 19.9719948,47.060378 C23.0479907,49.0232196 28.8239831,50.2451604 35.0439749,50.2451604 L35.4839744,50.2451604 L35.4839744,52.2288305 L35.0439749,52.2288305 C28.7249832,52.2288305 22.9819908,51.0554896 19.4699954,49.0728113 C18.7179964,49.6371655 18.0009974,50.397903 18.0009974,51.257824 C18.0009974,53.9695011 24.9999882,56.9916225 35.0439749,56.9916225 C45.0799617,56.9916225 52.0749525,53.9744602 52.0859525,51.2647668 L52.0859525,51.2548485 L52.0859525,51.2538566 C52.0839525,50.391952 51.3639534,49.6312145 50.6099544,49.0668603 C50.1219551,49.3435823 49.5989558,49.6103859 49.0039566,49.8553692 L48.2379576,48.022458 C48.9639566,47.7239156 49.5939558,47.4015692 50.1109551,47.0623616 C51.0129539,46.4742034 52.0869525,45.5547723 52.0869525,44.522272 L52.0869525,44.522272 Z M60.6529412,30.0166841 L55.0489486,30.0166841 C54.717949,30.0166841 54.4069494,29.8540231 54.2219497,29.5822603 C54.0349499,29.3104975 53.99695,28.9643471 54.1189498,28.6598537 L57.5279453,20.1380068 L44.6189702,20.1380068 L38.6189702,32.0400276 L45.0009618,32.0400276 C45.3199614,32.0400276 45.619961,32.1917784 45.8089608,32.44668 C45.9959605,32.7025735 46.0509604,33.0308709 45.9539606,33.3333806 L40.2579681,51.089212 L60.6529412,30.0166841 Z M63.7219372,29.7121907 L38.7229701,55.539576 C38.5279703,55.7399267 38.2659707,55.8440694 38.000971,55.8440694 C37.8249713,55.8440694 37.6479715,55.7994368 37.4899717,55.7052124 C37.0899722,55.4691557 36.9069725,54.992083 37.0479723,54.5517083 L43.6339636,34.0236978 L37.0009724,34.0236978 C36.6539728,34.0236978 36.3329732,33.8461593 36.1499735,33.5535679 C35.9679737,33.2609766 35.9509737,32.8959813 36.1069735,32.5885124 L43.1069643,18.7028214 C43.2759641,18.3665893 43.6219636,18.1543366 44.0009631,18.1543366 L59.0009434,18.1543366 C59.331943,18.1543366 59.6429425,18.3179894 59.8279423,18.5887604 C60.0149421,18.861515 60.052942,19.2066736 59.9309422,19.5121588 L56.5219467,28.0330139 L62.9999381,28.0330139 C63.3999376,28.0330139 63.7629371,28.2710544 63.9199369,28.6360497 C64.0769367,29.0020368 63.9989368,29.4255504 63.7219372,29.7121907 L63.7219372,29.7121907 Z M19.4549955,60.6743062 C20.8719936,61.4727334 22.6559912,62.1442057 24.7569885,62.6678947 L25.2449878,60.7437346 C23.3459903,60.2706293 21.6859925,59.6497405 20.4429942,58.949505 L19.4549955,60.6743062 Z M24.7569885,46.7985335 L25.2449878,44.8753653 C23.3459903,44.4012681 21.6859925,43.7803794 20.4429942,43.0801438 L19.4549955,44.804945 C20.8719936,45.6033722 22.6549912,46.2748446 24.7569885,46.7985335 L24.7569885,46.7985335 Z M19.4549955,28.9355839 L20.4429942,27.2107827 C21.6839925,27.9110182 23.3449903,28.5309151 25.2449878,29.0060041 L24.7569885,30.9291723 C22.6529912,30.4044916 20.8699936,29.7330193 19.4549955,28.9355839 L19.4549955,28.9355839 Z"
            id="Amazon-DynamoDB_Icon_64_Squid"
            fill="#FFFFFF"
          ></path>
        </g>
      </svg>
      <span className="text-nowrap">AWS DynamoDB</span>
    </div>
  );
}

export function MongoDBLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="60">
      <path
        d="M16.147 5.154l1.09 2.05a6.15 6.15 0 0 0 .824 1.024c.913.913 1.782 1.87 2.56 2.895 1.848 2.427 3.095 5.122 3.986 8.04.534 1.782.824 3.608.846 5.456.09 5.523-1.804 10.266-5.634 14.208a16.3 16.3 0 0 1-2.004 1.715c-.38 0-.557-.3-.713-.557-.3-.5-.468-1.047-.557-1.603-.134-.668-.223-1.336-.178-2.027v-.312c-.022-.067-.356-30.732-.223-30.888z"
        fill="#599636"
      />
      <path
        d="M16.147 5.088c-.045-.09-.09-.022-.134.022.022.445-.134.846-.38 1.225-.267.38-.624.668-.98.98-1.982 1.715-3.54 3.786-4.788 6.102-1.648 3.118-2.516 6.458-2.76 9.977-.11 1.27.4 5.746.802 7.037 1.09 3.43 3.05 6.302 5.6 8.796.624.6 1.292 1.158 1.982 1.692.2 0 .223-.178.267-.312a6.11 6.11 0 0 0 .2-.869c.2-1.113.312-2.227.445-3.34l-.245-31.31z"
        fill="#6cac48"
      />
      <path
        d="M17.24 41.9c.045-.512.3-.935.557-1.358-.267-.11-.468-.334-.624-.58-.134-.223-.245-.5-.334-.735-.312-.935-.38-1.915-.468-2.873v-.58c-.11.09-.134.846-.134.958-.067 1.024-.2 2.027-.4 3.006-.067.4-.11.802-.356 1.158 0 .045 0 .09.022.156.4 1.18.512 2.383.58 3.608v.445c0 .534-.022.423.423.6.178.067.38.09.557.223.134 0 .156-.11.156-.2l-.067-.735v-2.05c-.022-.356.045-.713.09-1.047z"
        fill="#c2bfbf"
      />
      <g transform="matrix(1.021124 0 0 1.021124 -4.376266 -1.845946)">
        <path
          d="M37.73 33.72v2.077a1.45 1.45 0 0 0 .014.246c.027.246.178.396.4.465a4.97 4.97 0 0 0 .63.123c.123.014.164.068.178.2.014.465-.027.52-.478.492-1.052-.055-2.105-.068-3.157 0h-.1c-.328.014-.355-.014-.355-.342 0-.055.014-.123.014-.178 0-.1.068-.15.164-.15.22-.027.424-.082.63-.123.287-.068.45-.246.478-.533.04-.314.04-.642.04-.957l.014-3.662a.56.56 0 0 0-.3-.52 3.89 3.89 0 0 0-.78-.328c-.082-.027-.164-.04-.232-.082-.2-.096-.205-.273-.014-.383.068-.04.15-.068.232-.082a12.42 12.42 0 0 0 2.432-.615c.164-.055.205-.04.22.123.014.1 0 .22-.014.314-.027.178-.027.355-.027.52 0 .068.014.137.082.178s.137 0 .2-.04c.287-.22.574-.424.888-.6.45-.246.93-.465 1.45-.533.63-.082 1.175.082 1.654.492a3.1 3.1 0 0 1 .519.601c.137.2.15.205.328.068.52-.383 1.066-.724 1.654-.97.615-.26 1.244-.3 1.872-.082.642.232 1.08.683 1.34 1.298.22.492.314 1 .314 1.53v3.662c0 .246.1.4.342.52.26.1.547.15.82.205.178.04.178.04.178.22-.027.45-.068.478-.506.45a29.42 29.42 0 0 0-3.293 0c-.22.014-.22.014-.232-.205v-.068c-.014-.37-.014-.37.342-.45l.355-.096a.55.55 0 0 0 .424-.533l.04-1.025-.027-2.678a2.13 2.13 0 0 0-.15-.697c-.342-.834-1.093-1.134-1.818-1.052-.547.055-1.025.273-1.476.588-.096.068-.164.15-.15.287.123.875.04 1.75.055 2.624v1.9c0 .342.137.506.465.588l.63.137c.096.014.15.055.15.164v.1c-.014.383-.04.4-.424.396-1.093-.055-2.187-.04-3.266 0-.37.014-.4-.027-.383-.4.014-.22.04-.232.246-.273l.45-.082c.4-.082.547-.232.574-.656l.04-.916-.027-2.747c-.027-.342-.1-.67-.287-.984-.273-.506-.7-.765-1.285-.793-.588-.04-1.107.178-1.6.45-.342.2-.492.437-.465.834v1.995zm25.747.083v1.927a4.13 4.13 0 0 0 .027.41.42.42 0 0 0 .328.383 3.19 3.19 0 0 0 .724.123c.137.014.164.068.178.178v.096c-.014.478-.068.533-.533.506-1.04-.068-2.077-.055-3.116 0l-.4.014c-.082 0-.1-.04-.123-.096a1.39 1.39 0 0 1 0-.574c.014-.082.068-.1.15-.123.2-.027.37-.068.56-.1.342-.082.465-.22.478-.574l.04-1.148v-3.362c0-.246-.096-.396-.314-.506-.246-.137-.506-.232-.78-.328-.082-.027-.164-.055-.232-.096-.178-.123-.2-.3-.027-.437a.49.49 0 0 1 .273-.11c.875-.137 1.722-.328 2.542-.656.096-.04.137-.014.178.068s.055.178.04.273l-.04.642c0 .082-.04.2.027.232.082.055.137-.068.205-.1a6.09 6.09 0 0 1 1.326-.847c.424-.2.86-.328 1.353-.3.916.055 1.572.52 1.995 1.326.22.424.314.888.355 1.367l.04 1 .014 3.02c.014.232.096.383.328.465a4.47 4.47 0 0 0 .738.178c.22.027.232.068.246.273v.068c-.027.465-.055.478-.52.45a28.59 28.59 0 0 0-3.061 0c-.137.014-.273 0-.4.014-.082 0-.137-.014-.15-.096-.027-.178-.055-.355-.014-.547.014-.082.055-.123.15-.137l.63-.1c.22-.055.342-.2.37-.4l.027-.383-.014-2.856c0-.328-.014-.656-.082-.984-.164-.7-.697-1.2-1.42-1.27-.63-.068-1.2.096-1.722.437-.26.164-.37.396-.37.683v2.064c0-.04 0-.04.014-.04z"
          fill="#47474a"
        />
        <path
          d="M103.503 29.935c-.15-.998-.52-1.886-1.162-2.665a5.27 5.27 0 0 0-2.105-1.558c-.86-.355-1.777-.465-2.706-.492-.383-.014-5.603.068-5.986 0-.096-.014-.164.014-.22.096-.068.1-.137.205-.178.314-.164.37-.164.342.232.396.328.055.642.082.957.178.287.096.492.26.56.574.027.15.055 4.96.055 7.202l-.055 1.6c-.014.123-.027.246-.068.355-.055.164-.15.3-.314.37a1.62 1.62 0 0 1-.574.15c-.37.04-.424.055-.547.465l-.04.15c-.027.178-.014.205.164.205l4.086.04 1.6-.027 1.107-.137c1.257-.232 2.378-.752 3.334-1.585a5.55 5.55 0 0 0 1.312-1.722c.383-.765.547-1.6.588-2.446.068-.478.04-.97-.04-1.462zm-1.982 1.94c-.055.875-.232 1.722-.683 2.487-.574.998-1.394 1.695-2.528 1.94-.492.1-.984.15-1.5.082-.37-.04-.724-.082-1.066-.205-.615-.22-.834-.6-.847-1.2l-.014-8.24c0-.492.22-.6.574-.615.533-.04 1.08-.027 1.613.027a6.06 6.06 0 0 1 1.654.4 3.98 3.98 0 0 1 1.08.67c.738.63 1.23 1.42 1.5 2.35.22.752.26 1.517.22 2.282zm13.34 1.34c0-.082 0-.15-.014-.232-.123-.752-.52-1.326-1.134-1.763-.396-.287-.847-.478-1.312-.615-.082-.027-.15-.055-.232-.068.014-.068.055-.082.096-.096.273-.137.533-.287.765-.492.424-.355.7-.793.847-1.326.082-.287.082-.574.055-.875a2.35 2.35 0 0 0-.998-1.777c-.63-.465-1.367-.656-2.132-.67-1.476-.027-2.965 0-4.44 0-.424 0-.847.027-1.285-.04-.082-.014-.2-.04-.26.055-.1.178-.22.355-.26.56-.014.096.014.15.123.164l.943.137c.37.055.63.26.656.588a5.78 5.78 0 0 1 .04.683l-.027 2.555-.014 5.056c0 .3-.04.588-.096.888a.5.5 0 0 1-.355.41c-.273.082-.533.164-.82.164a.34.34 0 0 0-.355.232c-.055.123-.1.26-.123.383-.027.164.014.22.178.2.123-.014 4.633.096 5.48.014.506-.055 1-.123 1.503-.273.86-.273 1.654-.67 2.282-1.34.52-.547.82-1.203.847-1.968.04-.178.04-.355.04-.547zm-6.628-5.6l.04-1.093c0-.205.082-.3.287-.342.328-.068.656-.04.984-.027.328.027.642.068.97.164.6.178 1.066.52 1.34 1.093a1.96 1.96 0 0 1 .191.834c.014.383-.014.752-.164 1.12-.232.506-.6.834-1.134.93s-2.05.055-2.282.055c-.205 0-.22-.027-.22-.232V28.83a8.79 8.79 0 0 1-.014-1.203zm4.44 7.352c-.232.615-.656 1.04-1.257 1.27-.328.123-.656.2-1 .178-.424-.014-.847 0-1.27-.082-.574-.123-.834-.67-.875-1.066-.068-.697-.027-1.408-.04-1.927v-1.804c0-.22.027-.287.26-.287l1.285.014.875.1c.615.137 1.175.37 1.613.847.355.383.547.847.588 1.353.04.478.014.943-.164 1.394z"
          fill="#c2bfbf"
        />
        <path
          d="M77.95 30.85l.355.055c.383.014.834-.123.97-.656a1.38 1.38 0 0 0 0-.78c-.082 0-.123.068-.164.096-.205.164-.437.26-.683.287-.492.055-.984.027-1.462-.15l-.67-.232a3.95 3.95 0 0 0-1.45-.19c-.697.055-1.353.287-1.968.615-.656.355-1.12.888-1.34 1.613-.123.424-.137.86-.082 1.298.137.998.656 1.695 1.585 2.064.055.014.096.04.15.055.123.068.137.137.027.232l-.342.232-.82.506c-.205.123-.232.22-.164.437a1.43 1.43 0 0 0 .437.656 2.28 2.28 0 0 0 .629.383c.15.068.15.1.014.22l-.78.56c-.26.2-.52.4-.738.656a1.35 1.35 0 0 0-.328 1.23 2.31 2.31 0 0 0 .71 1.23 2.9 2.9 0 0 0 1.257.683c.765.22 1.558.232 2.337.082 1.12-.205 2.1-.7 2.87-1.544.533-.56.847-1.216.875-2a1.92 1.92 0 0 0-1.476-1.995l-.738-.137-2.255-.2c-.246-.014-.492-.055-.697-.178-.26-.164-.328-.478-.164-.683.123-.15.273-.246.465-.26l.437-.04a3.96 3.96 0 0 0 2.309-1.052 2.42 2.42 0 0 0 .697-1.162c.164-.588.164-1.2.027-1.8-.04-.15-.027-.164.164-.137zm-3.35 6.807c.082.014.164 0 .246 0 .574.027 1.162.068 1.722.22a3.58 3.58 0 0 1 .533.205c.547.3.752.82.683 1.38-.082.615-.424 1.052-.957 1.34-.355.2-.752.287-1.162.328-.15.014-.287 0-.437 0-.478.014-.943-.04-1.394-.232-.314-.123-.574-.3-.806-.547-.478-.478-.7-1.353.014-2.064.437-.4.93-.683 1.558-.63zm1.558-4.264c-.287.724-.916.943-1.544.847-.574-.082-.998-.396-1.27-.916-.355-.697-.45-1.42-.246-2.173.15-.56.492-.984 1.093-1.08.765-.137 1.5.137 1.886.902.2.37.287.82.287 1.462-.014.26-.068.615-.205.957zm-17.218-.93c-.123-.738-.396-1.408-.902-1.968-.752-.834-1.708-1.2-2.788-1.203-.943-.014-1.83.26-2.624.752a3.56 3.56 0 0 0-1.599 2.091c-.232.793-.22 1.6-.04 2.405.478 2.16 2.146 3.088 4.14 2.952.588-.04 1.148-.232 1.68-.492.793-.37 1.367-.957 1.763-1.736.314-.642.45-1.326.437-2.105l-.068-.697zM57 35.497a1.66 1.66 0 0 1-1.408 1.148c-.6.082-1.162-.068-1.667-.424a2.84 2.84 0 0 1-.861-1.025c-.56-1.148-.656-2.35-.37-3.58a2.05 2.05 0 0 1 .574-.998c.506-.465 1.093-.574 1.75-.437.63.137 1.107.478 1.5.998s.574 1.12.683 1.75c.055.314.055.642.068.847 0 .656-.055 1.2-.26 1.722zm31.8-2.924c-.1-.793-.396-1.517-.957-2.118-.738-.806-1.695-1.148-2.76-1.162-.916-.014-1.763.246-2.542.697-.875.52-1.476 1.257-1.708 2.255a4.77 4.77 0 0 0 .328 3.252c.45.957 1.216 1.572 2.228 1.845 1.12.3 2.187.164 3.225-.342.902-.437 1.544-1.12 1.913-2.05.22-.547.3-1.134.314-1.818.014-.123-.014-.342-.04-.56zm-1.886 2.747c-.22.738-.683 1.216-1.462 1.326-.574.082-1.12-.055-1.613-.383-.424-.287-.724-.67-.943-1.12-.246-.478-.383-.984-.437-1.503-.082-.642-.082-1.27.068-1.913a1.95 1.95 0 0 1 .123-.369c.383-.957 1.23-1.394 2.228-1.175.67.15 1.175.52 1.558 1.08.37.547.547 1.148.63 1.8.04.26.055.533.04.765 0 .533-.04 1.025-.2 1.503z"
          fill="#47474a"
        />
      </g>
    </svg>
  );
}
