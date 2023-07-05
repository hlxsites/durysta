# Durysta.com ( Abbvie )
AEM Franklin Implementation for https://www.durysta.com/

## Environments
- Preview: https://main--durysta--hlxsites.hlx.page/
- Live: https://main--durysta--hlxsites.hlx.live/
- Existing Site - https://www.durysta.com/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Consistent styling

### Breakpoints

Small (mobile): 576px

Medium (tablet): 768px

Large (laptop): 992px

XLarge (desktop): 1200px

### Colors

    --clr-dark-grey: #414042;
    --clr-green: #00806e;
    --clr-orange-brown: #c4622d;
    --clr-yellow: #ffc60b;

### Suggested text sizing

**H2**

    font-size: 30px
    line-height: 1.2
    font-family: 'ITC Avant Garde Gothic W01 Md'

    @media (min-width: 767px) {
        font-size: 32px
    }

**H3**

    font-size: 21px
    line-height: 1.2
    font-family: 'ITC Avant Garde Gothic W01 Dm'
    
    @media (min-width: 767px) {
        font-size: 24px
    }

**H4**

    font-size: 18px
    line-height: 1.33
    font-family: 'ITC Avant Garde Gothic W01 Bd'

    @media (min-width: 767px) {
        font-size: 24px
        line-height: 1
    }

**H5 - use for avant-bold class**

    font-size: 16px
    line-height: 1.25
    font-family: 'ITC Avant Garde Gothic W01 Bd'

    @media (min-width: 767px) {
        font-size: 18px
        line-height: 1.33
    }

**p**

    font-size: 16px
    line-height: 1.25
    font-family: 'ITC Avant Garde Gothic W01 Md'

    @media (min-width: 767px) {
        font-size: 18px
        line-height: 1.33
    }
    
**strong - use for avant-demi class**

    font-family: 'ITC Avant Garde Gothic W01 Dm'
